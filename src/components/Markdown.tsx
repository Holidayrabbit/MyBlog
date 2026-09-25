import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import CodeBlock from './CodeBlock';

interface MarkdownProps {
  content: string;
  /** 可选：解析图片 src（管理后台预览用本地 objectURL 显示待上传图片），站点渲染不传 */
  resolveImageSrc?: (src: string) => string;
}

/**
 * 站点统一的 Markdown 渲染组件（文章详情页、管理后台预览共用）
 */
const Markdown: React.FC<MarkdownProps> = ({ content, resolveImageSrc }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        h1: ({ children }) => <h1 className="md-h1">{children}</h1>,
        h2: ({ children }) => <h2 className="md-h2">{children}</h2>,
        h3: ({ children }) => <h3 className="md-h3">{children}</h3>,
        p: ({ children }) => <p className="md-p">{children}</p>,
        code: ({ children, className, ...props }) => {
          const inline = !className;
          return (
            <CodeBlock className={className} inline={inline} {...props}>
              {children}
            </CodeBlock>
          );
        },
        ul: ({ children }) => <ul className="md-ul">{children}</ul>,
        ol: ({ children }) => <ol className="md-ol">{children}</ol>,
        li: ({ children }) => <li className="md-li">{children}</li>,
        blockquote: ({ children }) => <blockquote className="md-blockquote">{children}</blockquote>,
        img: ({ src, alt }) => (
          <img
            src={src && resolveImageSrc ? resolveImageSrc(src) : src}
            alt={alt}
            className="md-img"
            loading="lazy"
          />
        ),
        table: ({ children }) => <table className="md-table">{children}</table>,
        thead: ({ children }) => <thead className="md-thead">{children}</thead>,
        tbody: ({ children }) => <tbody className="md-tbody">{children}</tbody>,
        tr: ({ children }) => <tr className="md-tr">{children}</tr>,
        th: ({ children }) => <th className="md-th">{children}</th>,
        td: ({ children }) => <td className="md-td">{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;
