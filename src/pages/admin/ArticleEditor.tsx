import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { GitHubError, imageAttachmentFor, parseArticleFile, saveArticleCommit } from '../../utils/githubApi';
import type { AdminArticle, Frontmatter, ImageAttachment } from '../../utils/githubApi';
import { useTheme } from '../../hooks/useTheme';

interface ArticleEditorProps {
  token: string;
  article: AdminArticle | null; // null 表示新建
  onDone: () => void;
  onCancel: () => void;
}

interface DraftState {
  title: string;
  date: string;
  tags: string;
  excerpt: string;
  content: string;
  filename: string;
  savedAt: number;
}

const DRAFT_KEY = 'myblog_admin_draft:current';
// Vditor 静态资源自托管在 public/vditor（解析器/高亮/公式），不依赖外部 CDN
const VDITOR_CDN = `${import.meta.env.BASE_URL}vditor`;

function todayString(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

/**
 * 从标题推荐文件名：英文转 kebab-case；中文标题直接沿用（与现有中文文件名文章一致）
 */
function suggestFilename(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return '';
  if (/^[\x20-\x7E\s]+$/.test(trimmed)) {
    return (
      trimmed
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-') || ''
    );
  }
  return trimmed.replace(/[\\/:*?"<>|#%&{}$!'@+`=]/g, '');
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({ token, article, onDone, onCancel }) => {
  const { theme } = useTheme();

  // 远端（或新建模板）的基准内容
  const base = useMemo(() => {
    if (article) {
      const { frontmatter, content } = parseArticleFile(article.content);
      return {
        title: frontmatter.title || '',
        date: frontmatter.date || todayString(),
        tags: (frontmatter.tags || []).join(', '),
        excerpt: frontmatter.excerpt || '',
        filename: article.filename.replace(/\.md$/, ''),
        content,
      };
    }
    return { title: '', date: todayString(), tags: '', excerpt: '', filename: '', content: '# 新文章\n\n在这里开始写作...\n' };
  }, [article]);

  // 初始值：存在未保存的本地草稿时优先使用
  const initial = useMemo(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as DraftState;
        if (draft && typeof draft.content === 'string') {
          return { ...draft, fromDraft: true };
        }
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
    return { ...base, fromDraft: false };
  }, [base]);

  const [title, setTitle] = useState(initial.title);
  const [date, setDate] = useState(initial.date);
  const [tags, setTags] = useState(initial.tags);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [filename, setFilename] = useState(initial.filename);
  const [filenameEdited, setFilenameEdited] = useState(!!article); // 新建时标题自动带出文件名，手动改过就不再覆盖
  const [content, setContent] = useState(initial.content);
  const [draftRestored, setDraftRestored] = useState(initial.fromDraft);
  const [saving, setSaving] = useState(false);
  const [pendingImages, setPendingImages] = useState<ImageAttachment[]>([]);
  const [editorReady, setEditorReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const vditorRef = useRef<Vditor | null>(null);
  const vditorElRef = useRef<HTMLDivElement>(null);
  const filenameRef = useRef(filename);
  filenameRef.current = filename;
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const parsedTags = useMemo(
    () =>
      Array.from(
        new Set(
          tags
            .split(/[,，]/)
            .map(t => t.trim())
            .filter(Boolean),
        ),
      ),
    [tags],
  );

  const finalFilename = filename.endsWith('.md') ? filename : filename ? `${filename}.md` : '';

  // 创建 Vditor（IR 即时渲染，Typora 式体验：语法输入即原地渲染）
  useEffect(() => {
    if (!vditorElRef.current) return;
    let shouldDestroy = false; // StrictMode 下清理可能早于异步初始化完成，需延迟销毁
    const vditor = new Vditor(vditorElRef.current, {
      mode: 'ir',
      lang: 'zh_CN',
      theme: themeRef.current === 'dark' ? 'dark' : 'classic',
      value: initial.content,
      placeholder: '用 Markdown 写作...',
      height: 'auto',
      minHeight: 440,
      cache: { enable: false },
      cdn: VDITOR_CDN,
      counter: { enable: true, type: 'markdown' },
      toolbar: [
        'headings', 'bold', 'italic', 'strike', '|',
        'list', 'ordered-list', 'check', 'outdent', 'indent', '|',
        'quote', 'code', 'inline-code', 'table', 'link', '|',
        'upload', '|', 'undo', 'redo', '|', 'fullscreen',
      ],
      upload: {
        accept: 'image/*',
        multiple: true,
        handler: files => {
          if (!filenameRef.current) {
            setError('请先填写文件名，图片会按它归档到对应目录');
            return '请先填写文件名，再上传图片';
          }
          const articleIdNow = filenameRef.current.replace(/\.md$/, '');
          const md = files
            .map(file => {
              const attachment = imageAttachmentFor(articleIdNow, file);
              setPendingImages(prev => [...prev, attachment]);
              return `![${file.name.replace(/\.[^.]+$/, '')}](${attachment.url})`;
            })
            .join('\n');
          vditorRef.current?.insertValue(md);
          setNotice(
            files.length === 1
              ? '已插入图片引用，保存时与文章合并为一个 commit'
              : `已插入 ${files.length} 张图片引用，保存时与文章合并为一个 commit`,
          );
          return null;
        },
      },
      after: () => {
        if (shouldDestroy) {
          vditor.destroy();
          return;
        }
        vditorRef.current = vditor;
        setEditorReady(true);
      },
      input: value => setContent(value),
    });
    return () => {
      if (vditorRef.current === vditor) {
        vditorRef.current = null;
        setEditorReady(false);
        vditor.destroy();
      } else {
        shouldDestroy = true; // 异步初始化尚未完成，after 回调里再销毁
      }
    };
  }, [initial]);

  // 编辑器主题跟随站点明暗切换
  useEffect(() => {
    vditorRef.current?.setTheme(theme === 'dark' ? 'dark' : 'classic');
  }, [theme]);

  // 输入防抖后自动保存草稿到 localStorage，误关页面/断网也不丢稿
  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const draft: DraftState = { title, date, tags, excerpt, content, filename, savedAt: Date.now() };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    }, 600);
    return () => clearTimeout(timer);
  }, [title, date, tags, excerpt, content, filename]);

  // 有未保存的图片时拦截页面刷新/关闭，防止图片引用变成死链
  useEffect(() => {
    if (pendingImages.length === 0) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [pendingImages.length]);

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setTitle(base.title);
    setDate(base.date);
    setTags(base.tags);
    setExcerpt(base.excerpt);
    setFilename(base.filename);
    setFilenameEdited(!!article);
    setContent(base.content);
    vditorRef.current?.setValue(base.content);
    setDraftRestored(false);
    setNotice(null);
  };

  const handleCancel = () => {
    if (
      pendingImages.length > 0 &&
      !window.confirm(`有 ${pendingImages.length} 张图片尚未随文章保存，返回将丢失。确定返回吗？`)
    ) {
      return;
    }
    onCancel();
  };

  const handleSave = async () => {
    if (!vditorRef.current || !editorReady) {
      setError('编辑器尚未就绪，请稍候再试');
      return;
    }
    const content = vditorRef.current.getValue();
    if (!title.trim()) {
      setError('请填写标题');
      return;
    }
    if (!finalFilename) {
      setError('请填写文件名（将作为文章 ID 和图片目录名）');
      return;
    }
    if (!/^[\w\u4e00-\u9fa5.-]+\.md$/.test(finalFilename)) {
      setError('文件名只能包含中英文、数字、点、横线和下划线');
      return;
    }
    setError(null);
    setNotice(null);
    setSaving(true);
    try {
      const frontmatter: Frontmatter = { title: title.trim(), date, tags: parsedTags, excerpt: excerpt.trim() };
      // 只提交正文中实际引用了的图片，未引用的不上传
      const usedImages = pendingImages.filter(img => content.includes(img.url));
      await saveArticleCommit(token, {
        filename: finalFilename,
        frontmatter,
        content,
        isNew: !article,
        images: usedImages,
      });
      localStorage.removeItem(DRAFT_KEY);
      onDone();
    } catch (err) {
      setError(err instanceof GitHubError ? err.message : '保存失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-editor">
      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <button className="admin-btn" onClick={handleCancel}>
            <ArrowLeft size={15} />
            返回列表
          </button>
          <h1 className="admin-title">{article ? '编辑文章' : '新建文章'}</h1>
        </div>
        <div className="admin-toolbar-right">
          <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={15} className="admin-spin" /> : <Save size={15} />}
            {saving ? '正在保存...' : '保存并发布'}
          </button>
        </div>
      </div>

      {draftRestored && (
        <div className="admin-notice">
          已恢复上次未保存的本地草稿
          <button className="admin-btn" onClick={discardDraft}>
            丢弃草稿
          </button>
        </div>
      )}
      {notice && !draftRestored && <div className="admin-notice">{notice}</div>}
      {error && <div className="admin-error admin-error-banner">{error}</div>}

      <div className="admin-form">
        <div className="admin-form-row">
          <label className="admin-field admin-field-title">
            <span>标题</span>
            <input
              className="admin-input"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (!article && !filenameEdited) setFilename(suggestFilename(e.target.value));
              }}
              placeholder="文章标题"
            />
          </label>
          <label className="admin-field admin-field-date">
            <span>日期</span>
            <input className="admin-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </label>
        </div>
        <div className="admin-form-row">
          <label className="admin-field">
            <span>标签（逗号分隔）</span>
            <input
              className="admin-input"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="Agent, TypeScript, 教程"
            />
          </label>
          <label className="admin-field">
            <span>文件名{article ? '' : '（建议英文 slug，也可用中文）'}</span>
            <div className="admin-filename">
              <input
                className="admin-input"
                value={filename}
                onChange={e => {
                  setFilename(e.target.value);
                  setFilenameEdited(true);
                }}
                placeholder={title ? suggestFilename(title) || 'my-new-post' : 'my-new-post'}
                disabled={!!article}
              />
              <span className="admin-filename-ext">.md</span>
            </div>
          </label>
        </div>
        <label className="admin-field">
          <span>摘要（显示在文章列表卡片上）</span>
          <textarea
            className="admin-input admin-textarea-excerpt"
            rows={2}
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            placeholder="一两句话概括这篇文章"
          />
        </label>
      </div>

      <div ref={vditorElRef} className="admin-vditor" />

      <div className="admin-editor-footer">
        <span>
          {pendingImages.length > 0 && `${pendingImages.length} 张图片将随保存一起提交 · `}
          保存 = 提交 commit 到 main 分支，自动触发部署
        </span>
        <span className="admin-muted">
          {article ? `文件：public/articles/${finalFilename || article.filename}` : `文件：public/articles/${finalFilename || '（待填写）'}`}
        </span>
      </div>
    </div>
  );
};

export default ArticleEditor;
