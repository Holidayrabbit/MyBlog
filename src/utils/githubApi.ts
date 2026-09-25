import { load as yamlLoad } from 'js-yaml';

// 仓库配置：文章管理通过 GitHub Contents API 直接读写本仓库
const OWNER = 'Holidayrabbit';
const REPO = 'MyBlog';
const BRANCH = 'main';
const API_ROOT = 'https://api.github.com';
const ARTICLES_DIR = 'public/articles';
const IMAGES_DIR = 'public/images';

// 图片在站点中的访问前缀（vite base 为 /MyBlog/）
const IMAGE_BASE = `${import.meta.env.BASE_URL}images`.replace(/\/$/, '');

const TOKEN_KEY = 'myblog_admin_token';

// ============ Token 管理 ============

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ============ GitHub OAuth 一键登录（可选） ============
// 由 Cloudflare Worker 中转换取 token（GitHub 要求 secret，不能放前端）。
// 部署步骤见 cloudflare-worker/README.md；此处留空时后台仅显示 Token 登录方式。
export const OAUTH_WORKER_URL: string = 'https://myblog-oauth.holidayyuetwo.workers.dev';

const OAUTH_STATE_KEY = 'myblog_oauth_state';
const OAUTH_ERROR_KEY = 'myblog_oauth_error';

function randomState(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * 跳转到 Worker 开始 GitHub 授权（点击"使用 GitHub 登录"时调用）
 */
export function startOAuthLogin(): void {
  if (!OAUTH_WORKER_URL) return;
  const state = randomState();
  sessionStorage.setItem(OAUTH_STATE_KEY, state);
  window.location.href = `${OAUTH_WORKER_URL}/auth?state=${state}`;
}

/**
 * 处理 Worker 带回的登录结果，必须在 React 渲染前（main.tsx）调用。
 *
 * Worker 会跳回 `?access_token=...&oauth_state=...`（查询参数在 # 之前，不干扰
 * HashRouter 的路由 hash）。这里校验 state 防止 CSRF，通过后存入 localStorage；
 * 无论成功与否都立即把 URL 清理干净，避免 token 残留在地址栏和历史记录里。
 * 授权失败时 Worker 带回 ?oauth_error=...，暂存到 sessionStorage 由登录页展示。
 */
export function captureOAuthResult(): void {
  if (!window.location.search) return;
  const params = new URLSearchParams(window.location.search);
  const token = params.get('access_token');
  const state = params.get('oauth_state');
  const error = params.get('oauth_error');
  if (!token && !error) return;

  history.replaceState(null, '', `${window.location.pathname}#/admin`);

  if (error) {
    sessionStorage.setItem(OAUTH_ERROR_KEY, error);
    return;
  }
  const expected = sessionStorage.getItem(OAUTH_STATE_KEY);
  sessionStorage.removeItem(OAUTH_STATE_KEY);
  if (!token || !state || state !== expected) {
    sessionStorage.setItem(OAUTH_ERROR_KEY, '登录状态校验失败，请重新登录');
    return;
  }
  storeToken(token);
}

/**
 * 读取并清除 OAuth 过程中的错误信息（Admin 挂载时调用一次）
 */
export function consumeOAuthError(): string | null {
  const message = sessionStorage.getItem(OAUTH_ERROR_KEY);
  if (message) sessionStorage.removeItem(OAUTH_ERROR_KEY);
  return message;
}

// ============ 基础请求 ============

export class GitHubError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'GitHubError';
  }
}

interface GhRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
}

interface GhRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  accept?: string; // 覆盖 Accept 头（如 raw 媒体类型直接取文件原文）
}

async function ghRequest(path: string, token: string, options: GhRequestOptions = {}): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(`${API_ROOT}${path}`, {
      method: options.method || 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: options.accept || 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
    });
  } catch {
    throw new GitHubError(0, '网络请求失败，请检查网络连接');
  }

  if (!response.ok) {
    let message = `GitHub API 错误 (HTTP ${response.status})`;
    try {
      const data = await response.json();
      if (data?.message) message = data.message;
    } catch {
      // 保留默认错误信息
    }
    if (response.status === 401) {
      message = 'Token 无效或已过期，请重新登录';
    } else if (response.status === 403 && message.includes('rate limit')) {
      message = '已超出 GitHub API 速率限制，请稍后再试';
    }
    throw new GitHubError(response.status, message);
  }

  return response;
}

async function ghFetch<T>(path: string, token: string, options: GhRequestOptions = {}): Promise<T> {
  const response = await ghRequest(path, token, options);
  return (await response.json()) as T;
}

/** 以 raw 媒体类型获取文件原文（Contents API 的目录列表不返回内容字段） */
async function ghFetchRaw(path: string, token: string): Promise<string> {
  const response = await ghRequest(path, token, { accept: 'application/vnd.github.raw' });
  return response.text();
}

// ============ Frontmatter 解析与序列化 ============

export interface Frontmatter {
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
}

function toErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/**
 * 解析 markdown 文件的 frontmatter 和正文
 * frontmatter 使用 js-yaml 解析，兼容旧文章的各种写法
 */
export function parseArticleFile(raw: string): { frontmatter: Partial<Frontmatter>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { frontmatter: {}, content: raw };
  }
  let data: Record<string, unknown> = {};
  try {
    data = (yamlLoad(match[1]) as Record<string, unknown>) || {};
  } catch (err) {
    console.warn('frontmatter 解析失败，将按无 frontmatter 处理:', toErrorMessage(err));
  }
  const tags = Array.isArray(data.tags)
    ? data.tags.map(String)
    : data.tags
      ? [String(data.tags)]
      : [];
  return {
    frontmatter: {
      title: data.title != null ? String(data.title) : '',
      date: data.date != null ? String(data.date) : '',
      tags,
      excerpt: data.excerpt != null ? String(data.excerpt) : '',
    },
    content: raw.slice(match[0].length).replace(/^\s*\n/, ''),
  };
}

/**
 * 将 frontmatter 和正文序列化为完整的 markdown 文件
 * 字符串统一用双引号（JSON 风格），与现有文章格式保持一致
 */
export function buildArticleFile(frontmatter: Frontmatter, content: string): string {
  const tags = JSON.stringify(frontmatter.tags);
  const fm = [
    '---',
    `title: ${JSON.stringify(frontmatter.title)}`,
    `date: ${JSON.stringify(frontmatter.date)}`,
    `tags: ${tags}`,
    `excerpt: ${JSON.stringify(frontmatter.excerpt)}`,
    '---',
    '',
    '',
  ].join('\n');
  return `${fm}${content.replace(/^\s*\n/, '')}`;
}

// ============ GitHub API ============

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
}

interface RepoInfo {
  permissions?: { admin?: boolean; push?: boolean; pull?: boolean };
}

export interface ContentInfo {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: 'file' | 'dir';
}

/**
 * 校验 Token 并登录：
 * 1. 必须对本仓库有写权限（push）
 * 2. 必须是仓库所有者本人的账号，否则拒绝（防止任何有协作者权限的 Token 登录）
 */
export async function loginWithToken(token: string): Promise<GitHubUser> {
  const repo = await ghFetch<RepoInfo>(`/repos/${OWNER}/${REPO}`, token);
  if (!repo.permissions?.push) {
    throw new GitHubError(403, '该 Token 没有本仓库的写权限，请检查 Token 的仓库和权限设置');
  }
  let user: GitHubUser;
  try {
    user = await ghFetch<GitHubUser>('/user', token);
  } catch {
    throw new GitHubError(
      403,
      '无法验证 Token 所属的 GitHub 账号。请确认 Token 有效且可读取账号信息后重试',
    );
  }
  if (user.login.toLowerCase() !== OWNER.toLowerCase()) {
    throw new GitHubError(
      403,
      `登录被拒绝：仅允许仓库所有者 ${OWNER} 使用后台，当前 Token 属于账号 ${user.login}`,
    );
  }
  return user;
}

export interface AdminArticle {
  filename: string;
  sha: string;
  size: number;
  frontmatter: Partial<Frontmatter>;
  content: string;
}

/**
 * 拉取文章目录及各文件内容，按日期倒序。
 * 注意：Contents API 的目录列表不返回文件内容，需按 raw 媒体类型逐个获取。
 */
export async function listAdminArticles(token: string): Promise<AdminArticle[]> {
  const files = await ghFetch<ContentInfo[]>(
    `/repos/${OWNER}/${REPO}/contents/${ARTICLES_DIR}?ref=${BRANCH}`,
    token,
  );
  const mdFiles = files.filter(file => file.type === 'file' && file.name.endsWith('.md'));
  const articles = await Promise.all(
    mdFiles.map(async file => {
      const raw = await ghFetchRaw(
        `/repos/${OWNER}/${REPO}/contents/${ARTICLES_DIR}/${encodeURIComponent(file.name)}?ref=${BRANCH}`,
        token,
      );
      const { frontmatter } = parseArticleFile(raw);
      return { filename: file.name, sha: file.sha, size: file.size, frontmatter, content: raw };
    }),
  );
  return articles.sort((a, b) => (b.frontmatter.date || '').localeCompare(a.frontmatter.date || ''));
}

/**
 * 随保存一起提交的图片：path 为仓库内路径，url 为站点上的最终访问地址
 */
export interface ImageAttachment {
  path: string;
  url: string;
  file: File;
}

/**
 * 计算图片在仓库中的路径与站点 URL（文件名中的非法字符替换为下划线）
 */
export function imageAttachmentFor(articleId: string, file: File): ImageAttachment {
  const safeName = file.name.replace(/[^\w.\-\u4e00-\u9fa5]/g, '_');
  return {
    path: `${IMAGES_DIR}/${articleId}/${safeName}`,
    url: `${IMAGE_BASE}/${articleId}/${safeName}`,
    file,
  };
}

async function fileToBase64(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  bytes.forEach(byte => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

export interface SaveArticleParams {
  filename: string;
  frontmatter: Frontmatter;
  content: string;
  isNew: boolean;
  images?: ImageAttachment[]; // 随本次保存一起提交的图片
}

/**
 * 保存文章（可附带图片）为**同一个 commit**。
 *
 * Contents API 每次只能提交一个文件，因此这里走 Git Data API：
 * 建 blob → 基于当前 main 的 tree 建 tree → 建 commit → 推进 main 引用。
 * 好处：文章与 N 张图片一次提交只触发一次部署；且天然无 sha 冲突。
 */
export async function saveArticleCommit(
  token: string,
  params: SaveArticleParams,
): Promise<{ sha: string; html_url: string }> {
  const imageCount = params.images?.length ?? 0;
  const suffix = imageCount > 0 ? `（含 ${imageCount} 张图片）` : '';
  const message = params.isNew
    ? `feat: 添加文章《${params.frontmatter.title}》${suffix}`
    : `docs: 更新文章《${params.frontmatter.title}》${suffix}`;

  const getHead = () =>
    ghFetch<{ object: { sha: string } }>(`/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`, token);

  let head = await getHead();
  for (let attempt = 0; attempt < 3; attempt++) {
    const headCommit = await ghFetch<{ tree: { sha: string } }>(
      `/repos/${OWNER}/${REPO}/git/commits/${head.object.sha}`,
      token,
    );

    const entries: Array<{ path: string; mode: string; type: string; sha: string }> = [];

    const mdBlob = await ghFetch<{ sha: string }>(`/repos/${OWNER}/${REPO}/git/blobs`, token, {
      method: 'POST',
      body: { content: buildArticleFile(params.frontmatter, params.content), encoding: 'utf-8' },
    });
    entries.push({
      path: `${ARTICLES_DIR}/${params.filename}`,
      mode: '100644',
      type: 'blob',
      sha: mdBlob.sha,
    });

    for (const image of params.images ?? []) {
      const imgBlob = await ghFetch<{ sha: string }>(`/repos/${OWNER}/${REPO}/git/blobs`, token, {
        method: 'POST',
        body: { content: await fileToBase64(image.file), encoding: 'base64' },
      });
      entries.push({ path: image.path, mode: '100644', type: 'blob', sha: imgBlob.sha });
    }

    const tree = await ghFetch<{ sha: string }>(`/repos/${OWNER}/${REPO}/git/trees`, token, {
      method: 'POST',
      body: { base_tree: headCommit.tree.sha, tree: entries },
    });
    const commit = await ghFetch<{ sha: string; html_url: string }>(
      `/repos/${OWNER}/${REPO}/git/commits`,
      token,
      { method: 'POST', body: { message, tree: tree.sha, parents: [head.object.sha] } },
    );

    try {
      await ghFetch(`/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, token, {
        method: 'PATCH',
        body: { sha: commit.sha, force: false },
      });
      return commit;
    } catch (err) {
      // main 引用在保存期间被并发推进（罕见）：基于最新 head 重建后重试
      const retryable = err instanceof GitHubError && (err.status === 409 || err.status === 422);
      if (!retryable || attempt === 2) throw err;
      head = await getHead();
    }
  }
  throw new Error('保存失败：重试次数已用完');
}

/**
 * 删除文章，并将其图片目录 public/images/<articleId>/ 下的图片一并删除（同一个 commit）。
 * Git Trees API 中把条目的 sha 置为 null 即表示删除该路径（需确保文件当前存在）。
 */
export async function deleteAdminArticle(
  token: string,
  filename: string,
  title?: string,
): Promise<void> {
  const articleId = filename.replace(/\.md$/, '');

  // 列出图片目录下的文件（目录不存在 = 无图片，404 视为正常）
  let imagePaths: string[] = [];
  try {
    const imageFiles = await ghFetch<ContentInfo[]>(
      `/repos/${OWNER}/${REPO}/contents/${IMAGES_DIR}/${encodeURIComponent(articleId)}?ref=${BRANCH}`,
      token,
    );
    imagePaths = imageFiles.filter(f => f.type === 'file').map(f => f.path);
  } catch (err) {
    if (!(err instanceof GitHubError && err.status === 404)) throw err;
  }

  const titleText = title || filename;
  const message =
    imagePaths.length > 0
      ? `chore: 删除文章《${titleText}》及 ${imagePaths.length} 张图片`
      : `chore: 删除文章《${titleText}》`;

  const getHead = () =>
    ghFetch<{ object: { sha: string } }>(`/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`, token);

  let head = await getHead();
  for (let attempt = 0; attempt < 3; attempt++) {
    const headCommit = await ghFetch<{ tree: { sha: string } }>(
      `/repos/${OWNER}/${REPO}/git/commits/${head.object.sha}`,
      token,
    );
    const tree = await ghFetch<{ sha: string }>(`/repos/${OWNER}/${REPO}/git/trees`, token, {
      method: 'POST',
      body: {
        base_tree: headCommit.tree.sha,
        tree: [
          { path: `${ARTICLES_DIR}/${filename}`, sha: null },
          ...imagePaths.map(path => ({ path, sha: null })),
        ],
      },
    });
    const commit = await ghFetch<{ sha: string; html_url: string }>(
      `/repos/${OWNER}/${REPO}/git/commits`,
      token,
      { method: 'POST', body: { message, tree: tree.sha, parents: [head.object.sha] } },
    );

    try {
      await ghFetch(`/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, token, {
        method: 'PATCH',
        body: { sha: commit.sha, force: false },
      });
      return;
    } catch (err) {
      const retryable = err instanceof GitHubError && (err.status === 409 || err.status === 422);
      if (!retryable || attempt === 2) throw err;
      head = await getHead();
    }
  }
  throw new Error('删除失败：重试次数已用完');
}

export interface DeployRun {
  id: number;
  status: 'queued' | 'in_progress' | 'completed' | null;
  conclusion: 'success' | 'failure' | 'cancelled' | null;
  html_url: string;
  created_at: string;
}

/**
 * 获取最近一次部署（Deploy to GitHub Pages）的状态
 */
export async function getLatestDeploy(token: string): Promise<DeployRun | null> {
  try {
    const data = await ghFetch<{ workflow_runs: DeployRun[] }>(
      `/repos/${OWNER}/${REPO}/actions/runs?per_page=1`,
      token,
    );
    return data.workflow_runs[0] || null;
  } catch {
    return null;
  }
}
