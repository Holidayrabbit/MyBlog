/**
 * MyBlog OAuth 中转（部署到 Cloudflare Workers，免费额度即可）
 *
 * 作用：GitHub 的 OAuth 要求 code 换 token 必须携带 client_secret，
 * secret 不能放进前端代码，所以由这个 Worker 代为保管并完成交换。
 *
 * 流程：
 *   1. 博客后台点击"使用 GitHub 登录" → 跳到本 Worker 的 /auth
 *   2. /auth 302 到 GitHub 授权页
 *   3. 用户同意后 GitHub 带 code 回到 /callback
 *   4. Worker 用 code + client_secret 换 access_token
 *   5. 校验账号必须是仓库所有者本人（不是则直接拒绝）
 *   6. 302 回博客后台，token 通过 URL 参数带回（前端会立即存储并从地址栏清除）
 *
 * 所有异常都会被捕获并带回博客登录页展示具体原因（不会出现 Cloudflare 1101 白屏），
 * 同时 console.error 记录堆栈，可在 Workers Logs 中查看。
 *
 * 需要配置的环境变量（Cloudflare Dashboard → Worker → Settings → Variables）：
 *   GITHUB_CLIENT_ID      GitHub OAuth App 的 Client ID（明文变量即可）
 *   GITHUB_CLIENT_SECRET  GitHub OAuth App 的 Client Secret（务必设为 Secret 类型）
 */

const OWNER = 'Holidayrabbit'; // 仓库所有者，非此账号一律拒绝
const SPA_REDIRECT = 'https://holidayrabbit.github.io/MyBlog/'; // 部署后的博客地址

const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN = 'https://github.com/login/oauth/access_token';
const GITHUB_USER = 'https://api.github.com/user';

function redirect(url) {
  return new Response(null, { status: 302, headers: { Location: url } });
}

function backToBlog(params) {
  const target = new URL(SPA_REDIRECT);
  for (const [key, value] of Object.entries(params)) {
    target.searchParams.set(key, value);
  }
  return redirect(target.toString());
}

/**
 * 解析 JSON 响应；非 JSON（如 HTML 错误页）时抛出带原始内容片段的错误，方便定位
 */
async function readJson(res, label) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${label} 返回非 JSON 响应（HTTP ${res.status}）：${text.slice(0, 120)}`);
  }
}

async function handle(request, env) {
  const url = new URL(request.url);

  // 入口：博客跳过来，转投 GitHub 授权页
  if (url.pathname === '/auth') {
    if (!env.GITHUB_CLIENT_ID) {
      return new Response('Worker 未配置 GITHUB_CLIENT_ID', { status: 500 });
    }
    const params = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      redirect_uri: `${url.origin}/callback`,
      scope: 'public_repo', // MyBlog 是公开仓库，public_repo 足够读写 Contents；若仓库转私有需改为 repo
      allow_signup: 'false',
    });
    if (url.searchParams.get('state')) {
      params.set('state', url.searchParams.get('state'));
    }
    return redirect(`${GITHUB_AUTHORIZE}?${params}`);
  }

  // 回调：GitHub 带着 code 回来，换 token → 校验身份 → 回博客
  if (url.pathname === '/callback') {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    // 用户在 GitHub 上点了拒绝
    if (!code) {
      const reason = url.searchParams.get('error_description') || 'GitHub 授权未完成';
      return backToBlog({ oauth_error: reason });
    }
    if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
      return backToBlog({ oauth_error: 'Worker 未配置 GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET 环境变量' });
    }

    // 1. code 换 access_token（secret 只存在这里）
    const tokenRes = await fetch(GITHUB_TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const tokenData = await readJson(tokenRes, 'GitHub Token 接口');
    if (!tokenData.access_token) {
      return backToBlog({
        oauth_error: `换取 Token 失败：${tokenData.error_description || tokenData.error || '未知错误'}`,
      });
    }

    // 2. 身份校验：只允许仓库所有者本人
    const userRes = await fetch(GITHUB_USER, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/vnd.github+json',
      },
    });
    const user = await readJson(userRes, 'GitHub 用户信息接口');
    if (!user.login || user.login.toLowerCase() !== OWNER.toLowerCase()) {
      return new Response(
        `登录被拒绝：仅允许仓库所有者 ${OWNER} 使用博客后台，当前账号为 ${user.login || '未知'}。`,
        { status: 403, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
      );
    }

    // 3. 带 token 回博客（前端立即存入 localStorage 并从地址栏清除）
    const back = { access_token: tokenData.access_token };
    if (state) back.oauth_state = state;
    return backToBlog(back);
  }

  return new Response('MyBlog OAuth Bridge\n\nGET /auth → 开始 GitHub 登录', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

export default {
  async fetch(request, env) {
    try {
      return await handle(request, env);
    } catch (err) {
      // 任何异常都记录堆栈并带回博客登录页展示，而不是 Cloudflare 1101 错误页
      console.error('OAuth bridge error:', err instanceof Error ? err.stack : err);
      const message = err instanceof Error ? err.message : String(err);
      return backToBlog({ oauth_error: `Worker 内部错误：${message}` });
    }
  },
};
