import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import './CodeBlock.css';

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  inline?: boolean;
}

/**
 * 解析行高亮语法，如：js{1,3-5}
 * @param className - 从markdown解析的className，格式如 "language-js{1,3-5}"
 * @returns 包含语言和高亮行的对象
 */
function parseLanguageAndHighlight(className?: string): {
  language: string;
  highlightLines: number[];
} {
  if (!className) {
    return { language: 'text', highlightLines: [] };
  }

  // 匹配 language-xxx{1,3-5} 格式
  const match = className.match(/language-(\w+)(?:\{([\d,-]+)\})?/);

  if (!match) {
    return { language: 'text', highlightLines: [] };
  }

  const language = match[1] || 'text';
  const highlightSpec = match[2];

  if (!highlightSpec) {
    return { language, highlightLines: [] };
  }

  // 解析高亮行，如 "1,3-5,7" => [1, 3, 4, 5, 7]
  const highlightLines: number[] = [];
  const parts = highlightSpec.split(',');

  parts.forEach(part => {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        highlightLines.push(i);
      }
    } else {
      highlightLines.push(Number(part));
    }
  });

  return { language, highlightLines };
}

/**
 * 获取语言的显示名称
 */
function getLanguageDisplayName(language: string): string {
  const languageMap: Record<string, string> = {
    js: 'JavaScript',
    jsx: 'JavaScript (JSX)',
    ts: 'TypeScript',
    tsx: 'TypeScript (TSX)',
    py: 'Python',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    cs: 'C#',
    go: 'Go',
    rs: 'Rust',
    rb: 'Ruby',
    php: 'PHP',
    swift: 'Swift',
    kt: 'Kotlin',
    dart: 'Dart',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    md: 'Markdown',
    sql: 'SQL',
    sh: 'Shell',
    bash: 'Bash',
    zsh: 'Zsh',
    powershell: 'PowerShell',
    dockerfile: 'Dockerfile',
    graphql: 'GraphQL',
    xml: 'XML',
    text: 'Plain Text',
  };

  return languageMap[language.toLowerCase()] || language.toUpperCase();
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className, inline }) => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  // 如果是行内代码，返回简单的样式
  if (inline) {
    return <code className="md-code">{children}</code>;
  }

  // 解析语言和高亮行
  const { language, highlightLines } = parseLanguageAndHighlight(className);

  // 提取代码内容
  const code = String(children).replace(/\n$/, '');

  // 计算行数
  const lineCount = code.split('\n').length;

  // 是否显示行号（超过10行）
  const showLineNumbers = lineCount > 10;

  // 复制到剪贴板
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // 选择主题
  const syntaxTheme = theme === 'dark' ? oneDark : oneLight;

  return (
    <div className="code-block-container">
      {/* 顶部工具栏：语言标签 + 复制按钮 */}
      <div className="code-block-header">
        <span className="code-block-language">{getLanguageDisplayName(language)}</span>
        <button
          className="code-block-copy-btn"
          onClick={handleCopy}
          aria-label="Copy code"
          title={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check size={16} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* 代码高亮器 */}
      <SyntaxHighlighter
        language={language}
        style={syntaxTheme}
        showLineNumbers={showLineNumbers}
        wrapLines={highlightLines.length > 0}
        lineProps={(lineNumber) => {
          const style: React.CSSProperties = {};
          if (highlightLines.includes(lineNumber)) {
            style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
            style.display = 'block';
            style.margin = '0 -16px';
            style.padding = '0 16px';
          }
          return { style };
        }}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 8px 8px',
          fontSize: '14px',
          lineHeight: '1.6',
        }}
        codeTagProps={{
          style: {
            fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
