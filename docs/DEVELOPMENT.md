# 💻 MyBlog 开发指南

> 深入了解项目架构，掌握开发技巧，贡献代码更轻松

## 🎯 开发环境准备

### 系统要求
- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 或 **yarn**: >= 1.22.0
- **Git**: 用于版本控制

### IDE推荐配置

#### VS Code（推荐）
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.autoFixOnSave": true
}
```

#### 推荐插件
```text
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- Prettier - Code formatter
- ESLint
```

### 环境配置
```bash
# 克隆项目
git clone https://github.com/YOUR_USERNAME/MyBlog.git
cd MyBlog

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 🏗️ 项目架构详解

### 核心架构图
```
MyBlog 架构
├── 📱 前端应用 (React + TypeScript)
│   ├── 🧩 组件层 (Components)
│   ├── 📄 页面层 (Pages) 
│   ├── 🔄 状态层 (Context + Hooks)
│   └── 🎨 样式层 (CSS)
├── 📝 内容层 (Markdown Articles)
├── 🤖 构建层 (Vite + Scripts)
└── 🚀 部署层 (GitHub Actions)
```

### 技术栈决策

| 技术选择 | 原因 | 替代方案 |
|---------|------|----------|
| **React** | 组件化、生态丰富 | Vue, Angular |
| **TypeScript** | 类型安全、开发效率 | JavaScript |
| **Vite** | 快速构建、HMR | Webpack, Parcel |
| **CSS Variables** | 原生支持、性能好 | Styled-components, Emotion |
| **React Router** | SPA路由标准 | Next.js, Reach Router |

### 目录结构深入分析

```
src/
├── 🧩 components/              # 可复用UI组件
│   ├── Header.tsx             # 导航栏组件
│   ├── Footer.tsx             # 页脚组件  
│   ├── Layout.tsx             # 页面布局容器
│   └── PDFViewer.tsx          # PDF预览组件
│
├── 📄 pages/                  # 页面级组件
│   ├── Home.tsx               # 首页 - 个人介绍
│   ├── Articles.tsx           # 文章列表页
│   ├── ArticleDetail.tsx      # 文章详情页
│   ├── Academic.tsx           # 学术页面
│   ├── Projects.tsx           # 项目展示页
│   └── Resume.tsx             # 简历页面
│
├── 🔄 contexts/               # React Context
│   └── ThemeContext.tsx       # 主题切换逻辑
│
├── 🪝 hooks/                  # 自定义Hooks
│   └── useArticles.ts         # 文章数据管理
│
├── 🏷️ types/                  # TypeScript类型定义
│   └── index.ts               # 全局接口和类型
│
├── 🌍 i18n/                   # 国际化配置
│   └── index.ts               # 中英文语言包
│
├── 🛠️ utils/                  # 工具函数
│   └── articles.ts            # 文章处理工具
│
└── 🎨 *.css                   # 样式文件
    ├── App.css                # 全局样式和CSS变量
    ├── components.css         # 组件样式
    ├── pages.css              # 页面样式
    └── article.css            # 文章样式
```

## 🧩 组件设计原则

### 组件分类

#### 1. 布局组件
```typescript
// Layout.tsx - 页面布局容器
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};
```

#### 2. 功能组件
```typescript
// PDFViewer.tsx - PDF查看器
interface PDFViewerProps {
  fileUrl: string;
  onLoadError?: (error: Error) => void;
}

const PDFViewer: FC<PDFViewerProps> = ({ fileUrl, onLoadError }) => {
  // PDF.js集成逻辑
  // 支持页面翻转、缩放等功能
};
```

#### 3. 页面组件
```typescript
// ArticleDetail.tsx - 文章详情页
const ArticleDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { articles, loading } = useArticles();
  
  // 文章渲染逻辑
  // Markdown解析和显示
};
```

### 组件命名规范

```typescript
// ✅ 推荐命名
const UserProfile: FC<UserProfileProps> = () => {};
const ArticleList: FC<ArticleListProps> = () => {};
const ThemeToggle: FC = () => {};

// ❌ 避免命名
const userprofile: FC = () => {};        // 小写
const Article_List: FC = () => {};       // 下划线
const themeToggleComponent: FC = () => {}; // 冗余后缀
```

## 🎨 样式系统详解

### CSS变量主题系统

```css
/* App.css - 主题变量定义 */
:root[data-theme="light"] {
  /* 基础色彩 */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #000000;
  --text-secondary: #6c757d;
  
  /* 功能色彩 */
  --border-color: #e9ecef;
  --hover-color: #f8f9fa;
  --focus-color: #0066cc;
  
  /* 间距变量 */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;
}

:root[data-theme="dark"] {
  --bg-primary: #000000;
  --bg-secondary: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --border-color: #333333;
  --hover-color: #1a1a1a;
  --focus-color: #66b3ff;
}
```

### 响应式设计断点

```css
/* 移动端优先的响应式设计 */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    padding: 0 var(--spacing-lg);
  }
}

/* 桌面端 */
@media (min-width: 1024px) {
  .container {
    padding: 0 var(--spacing-xl);
  }
}
```

### 组件样式规范

```css
/* 组件样式命名规范 */
.component-name {           /* 组件根元素 */
  /* 布局属性 */
  display: flex;
  flex-direction: column;
  
  /* 外观属性 */
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
}

.component-name__element {  /* 子元素 */
  /* BEM命名法 */
}

.component-name--modifier { /* 修饰符 */
  /* 状态变化 */
}
```

## 🔄 状态管理架构

### Context + Hooks模式

```typescript
// ThemeContext.tsx - 主题状态管理
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, [theme]);
  
  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

### 自定义Hooks设计

```typescript
// useArticles.ts - 文章数据管理Hook
interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  date: string;
  dateSort: string;
}

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 获取文章列表
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/articles.json');
      if (!response.ok) throw new Error('Failed to fetch articles');
      
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // 根据ID获取单篇文章
  const getArticleById = useCallback((id: string): Article | undefined => {
    return articles.find(article => article.id === id);
  }, [articles]);
  
  // 根据标签筛选文章
  const getArticlesByTag = useCallback((tag: string): Article[] => {
    return articles.filter(article => article.tags.includes(tag));
  }, [articles]);
  
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);
  
  return {
    articles,
    loading,
    error,
    getArticleById,
    getArticlesByTag,
    refetch: fetchArticles
  };
};
```

## 🌍 国际化系统

### i18n配置结构

```typescript
// i18n/index.ts - 多语言配置
export const resources = {
  zh: {
    translation: {
      nav: {
        home: '首页',
        articles: '文章',
        academic: '学术',
        projects: '项目',
        resume: '简历'
      },
      home: {
        title: '你好，我是{name}',
        description: '专注于{field}的开发者',
        stats: {
          articles: '篇文章',
          projects: '个项目',
          experience: '年经验'
        }
      },
      // ... 更多翻译
    }
  },
  en: {
    translation: {
      nav: {
        home: 'Home',
        articles: 'Articles', 
        academic: 'Academic',
        projects: 'Projects',
        resume: 'Resume'
      },
      // ... 英文翻译
    }
  }
};

// 使用示例
const Home: FC = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.title', { name: 'ZhaoQie' })}</h1>
      <p>{t('home.description', { field: '前端开发' })}</p>
    </div>
  );
};
```

## 🛠️ 开发工具配置

### ESLint配置

```javascript
// eslint.config.js
export default [
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // React相关
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      
      // TypeScript相关
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // 代码风格
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always']
    }
  }
];
```

### TypeScript配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/pages/*": ["src/pages/*"],
      "@/utils/*": ["src/utils/*"]
    }
  }
}
```

## 🧪 测试策略

### 测试框架配置

```bash
# 安装测试依赖
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

```typescript
// tests/setup.ts
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);
afterEach(() => {
  cleanup();
});
```

### 组件测试示例

```typescript
// tests/components/Header.test.tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/Header';

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  it('renders navigation links', () => {
    renderHeader();
    
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('文章')).toBeInTheDocument();
    expect(screen.getByText('项目')).toBeInTheDocument();
  });
  
  it('has theme toggle button', () => {
    renderHeader();
    
    const themeToggle = screen.getByRole('button', { name: /主题切换/i });
    expect(themeToggle).toBeInTheDocument();
  });
});
```

## 📊 性能优化指南

### 代码分割策略

```typescript
// 路由级代码分割
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('@/pages/Home'));
const Articles = lazy(() => import('@/pages/Articles'));
const Projects = lazy(() => import('@/pages/Projects'));

const App: FC = () => {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </Suspense>
  );
};
```

### 组件性能优化

```typescript
// 使用 React.memo 优化重渲染
const ExpensiveComponent = memo<ComponentProps>(({ data }) => {
  // 复杂的渲染逻辑
  return <div>{/* ... */}</div>;
}, (prevProps, nextProps) => {
  // 自定义比较逻辑
  return prevProps.data.id === nextProps.data.id;
});

// 使用 useMemo 缓存计算结果
const ProcessedData: FC<{ items: Item[] }> = ({ items }) => {
  const expensiveValue = useMemo(() => {
    return items.reduce((acc, item) => acc + item.value, 0);
  }, [items]);
  
  return <div>{expensiveValue}</div>;
};

// 使用 useCallback 缓存函数
const ParentComponent: FC = () => {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  return <ChildComponent onClick={handleClick} />;
};
```

## 🔧 开发工作流

### Git工作流

```bash
# 功能开发流程
git checkout -b feature/new-feature    # 创建功能分支
git add .                              # 暂存更改
git commit -m "✨ Add new feature"     # 提交更改
git push origin feature/new-feature   # 推送分支
# 创建Pull Request

# 提交信息规范
✨ feat: 新功能
🐛 fix: 修复bug
📝 docs: 文档更新
🎨 style: 代码格式调整
♻️ refactor: 重构
⚡ perf: 性能优化
🧪 test: 添加测试
🔧 chore: 构建过程或工具变动
```

### 开发调试技巧

```typescript
// 开发环境调试工具
if (process.env.NODE_ENV === 'development') {
  // React DevTools
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
  
  // 性能监控
  import('@welldone-software/why-did-you-render').then((whyDidYouRender) => {
    whyDidYouRender.default(React, {
      trackAllPureComponents: true,
    });
  });
}

// 自定义调试Hook
const useDebugValue = (value: any, formatter?: (value: any) => string) => {
  React.useDebugValue(value, formatter);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Debug Value:', value);
  }
};
```

### 常用开发命令

```bash
# 开发相关
npm run dev                    # 启动开发服务器
npm run articles:watch         # 监听文章变化
npm run type-check            # TypeScript类型检查
npm run lint                  # 代码规范检查
npm run lint:fix              # 自动修复代码规范问题

# 构建相关
npm run build                 # 构建生产版本
npm run preview               # 预览构建结果
npm run analyze               # 分析包大小

# 测试相关
npm run test                  # 运行测试
npm run test:watch            # 监听模式测试
npm run test:coverage         # 生成测试覆盖率报告
```

## 🤝 贡献指南

### 代码贡献流程

1. **Fork项目** - 在GitHub上fork项目到你的账户
2. **克隆代码** - `git clone https://github.com/YOUR_USERNAME/MyBlog.git`
3. **创建分支** - `git checkout -b feature/amazing-feature`
4. **编写代码** - 遵循项目编码规范
5. **测试验证** - 确保所有测试通过
6. **提交代码** - 使用规范的commit message
7. **推送分支** - `git push origin feature/amazing-feature`
8. **创建PR** - 在GitHub上创建Pull Request

### 代码审查清单

#### 代码质量
- [ ] 遵循TypeScript严格模式
- [ ] 组件有合适的PropTypes/接口定义
- [ ] 使用适当的React Hooks
- [ ] 避免不必要的重渲染
- [ ] 处理加载和错误状态

#### 用户体验
- [ ] 响应式设计正常工作
- [ ] 无障碍性考虑(a11y)
- [ ] 加载状态友好
- [ ] 错误处理完善

#### 性能考虑
- [ ] 组件适当使用memo/useMemo/useCallback
- [ ] 图片资源优化
- [ ] 避免内存泄漏
- [ ] 合理的代码分割

### 问题报告模板

```markdown
## 问题描述
简洁清晰地描述遇到的问题

## 复现步骤
1. 进入 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

## 预期行为
清晰简洁地描述你期望发生什么

## 实际行为
清晰简洁地描述实际发生了什么

## 环境信息
- 操作系统: [e.g. macOS 13.0]
- 浏览器: [e.g. Chrome 108]
- Node.js版本: [e.g. 18.12.0]
- 项目版本: [e.g. 1.0.0]

## 额外信息
添加任何其他相关信息或截图
```

---

## 🎯 开发最佳实践

### 代码风格
1. **一致性** - 遵循项目既定的代码风格
2. **可读性** - 变量名清晰，注释恰当
3. **简洁性** - 避免过度工程化
4. **可维护性** - 考虑未来的扩展需求

### 性能考虑
1. **首屏加载** - 关键路径优化
2. **运行时性能** - 避免不必要的计算
3. **内存管理** - 及时清理事件监听器和定时器
4. **网络请求** - 适当的缓存策略

### 用户体验
1. **响应式设计** - 移动端优先
2. **加载状态** - 友好的等待体验
3. **错误处理** - 优雅的错误提示
4. **无障碍性** - 考虑不同用户需求

现在你已经掌握了MyBlog项目的开发精髓，可以开始你的贡献之旅了！🚀
