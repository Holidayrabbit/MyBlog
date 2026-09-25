import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Eye, Image as ImageIcon, Loader2, Save } from 'lucide-react';
import Markdown from '../../components/Markdown';
import { GitHubError, imageAttachmentFor, parseArticleFile, saveArticleCommit } from '../../utils/githubApi';
import type { AdminArticle, Frontmatter, ImageAttachment } from '../../utils/githubApi';

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

/** 待提交图片：附上本地预览地址，保存成功或离开时释放 */
interface PendingImage extends ImageAttachment {
  previewUrl: string;
}

const DRAFT_KEY = 'myblog_admin_draft:current';

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
  const initial = useMemo(() => {
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
    return { title: '', date: todayString(), tags: '', excerpt: '', filename: '', content: '' };
  }, [article]);

  const [title, setTitle] = useState(initial.title);
  const [date, setDate] = useState(initial.date);
  const [tags, setTags] = useState(initial.tags);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [filename, setFilename] = useState(initial.filename);
  const [filenameEdited, setFilenameEdited] = useState(!!article); // 新建时标题自动带出文件名，手动改过就不再覆盖
  const [content, setContent] = useState(
    article ? initial.content : `# 新文章\n\n在这里开始写作...\n`,
  );
  const [draftRestored, setDraftRestored] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstRenderRef = useRef(true);

  // 恢复本地草稿（保存成功后草稿会被清除，所以存在草稿 = 上次未保存）
  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw) as DraftState;
      if (draft && typeof draft.content === 'string') {
        setTitle(draft.title);
        setDate(draft.date);
        setTags(draft.tags);
        setExcerpt(draft.excerpt);
        setFilename(draft.filename);
        setContent(draft.content);
        setDraftRestored(true);
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  // 输入防抖后自动保存草稿到 localStorage，误关页面/断网也不丢稿
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
  const articleId = filename.replace(/\.md$/, '');

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setTitle(initial.title);
    setDate(initial.date);
    setTags(initial.tags);
    setExcerpt(initial.excerpt);
    setFilename(initial.filename);
    setContent(article ? initial.content : `# 新文章\n\n在这里开始写作...\n`);
    setDraftRestored(false);
    setNotice(null);
  };

  const insertIntoEditor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent(c => c + text);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const next = content.slice(0, start) + text + content.slice(end);
    setContent(next);
    requestAnimationFrame(() => {
      textarea.focus();
      const pos = start + text.length;
      textarea.setSelectionRange(pos, pos);
    });
  };

  // 插入图片引用：图片暂存待传，保存时与文章合并为同一个 commit
  const handleUploadImages = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!articleId) {
      setError('请先填写文件名，图片会按它归档到对应目录');
      return;
    }
    setError(null);
    const added: PendingImage[] = Array.from(files).map(file => {
      const attachment = imageAttachmentFor(articleId, file);
      return { ...attachment, previewUrl: URL.createObjectURL(file) };
    });
    setPendingImages(prev => [...prev, ...added]);
    added.forEach(img => insertIntoEditor(`![${img.file.name.replace(/\.[^.]+$/, '')}](${img.url})\n`));
    setNotice(
      added.length === 1
        ? '已插入图片引用，点击"保存并发布"时与文章合并为一个 commit'
        : `已插入 ${added.length} 张图片引用，保存时与文章合并为一个 commit`,
    );
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 组件卸载时释放本地预览用 objectURL
  const pendingImagesRef = useRef<PendingImage[]>(pendingImages);
  pendingImagesRef.current = pendingImages;
  useEffect(
    () => () => {
      pendingImagesRef.current.forEach(img => URL.revokeObjectURL(img.previewUrl));
    },
    [],
  );

  // 有未保存的图片时拦截页面刷新/关闭，防止图片引用变成死链
  useEffect(() => {
    if (pendingImages.length === 0) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [pendingImages.length]);

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
      if (err instanceof GitHubError && err.status === 409) {
        setError('远端文章已被修改（可能是上次保存还没同步），请返回列表刷新后重试，本地草稿已自动保留');
      } else {
        setError(err instanceof GitHubError ? err.message : '保存失败，请稍后重试');
      }
    } finally {
      setSaving(false);
    }
  };

  // 预览时把待上传图片映射到本地 objectURL，直接看到图片效果
  const previewImageMap = useMemo(() => {
    const map = new Map<string, string>();
    pendingImages.forEach(img => map.set(img.url, img.previewUrl));
    return map;
  }, [pendingImages]);

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
          <button className="admin-btn" onClick={() => setPreviewOpen(v => !v)}>
            <Eye size={15} />
            {previewOpen ? '关闭预览' : '实时预览'}
          </button>
          <button
            className="admin-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={!articleId}
            title="插入图片引用，随文章保存在同一个 commit 中"
          >
            <ImageIcon size={15} />
            上传图片{pendingImages.length > 0 ? `（${pendingImages.length}）` : ''}
          </button>
          <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={15} className="admin-spin" /> : <Save size={15} />}
            {saving ? '正在保存...' : '保存并发布'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={e => handleUploadImages(e.target.files)}
          />
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

      <div className={`admin-editor-body ${previewOpen ? 'admin-editor-split' : ''}`}>
        <textarea
          ref={textareaRef}
          className="admin-markdown-input"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="用 Markdown 写作..."
          spellCheck={false}
        />
        {previewOpen && (
          <div className="admin-preview">
            <Markdown content={content} resolveImageSrc={src => previewImageMap.get(src) ?? src} />
          </div>
        )}
      </div>

      <div className="admin-editor-footer">
        <span>
          {content.length} 字符
          {pendingImages.length > 0 && ` · ${pendingImages.length} 张图片将随保存一起提交`}
          {' · 保存 = 提交 commit 到 main 分支，自动触发部署'}
        </span>
        <span className="admin-muted">
          {article ? `文件：public/articles/${finalFilename || article.filename}` : `文件：public/articles/${finalFilename || '（待填写）'}`}
        </span>
      </div>
    </div>
  );
};

export default ArticleEditor;
