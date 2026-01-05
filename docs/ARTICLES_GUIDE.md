# 📚 文章管理指南

> 全自动化的文章管理系统，让你专注于内容创作

## 🎯 概述

欢迎使用MyBlog的文章管理系统！这是一个完全自动化的解决方案，让你可以：

- ✅ **零配置写作** - 只需创建Markdown文件
- 🤖 **智能索引** - 自动生成文章列表和元数据
- 🏷️ **自动标签** - 根据内容智能提取标签
- 📝 **摘要生成** - 自动生成文章摘要
- 🔄 **实时更新** - 所有页面自动同步

## 🚀 快速开始

### 1. 添加新文章

在 `public/articles/` 目录下创建新的 `.md` 文件：

```bash
# 例如：创建新文章
touch public/articles/new-article.md
```

### 2. 编写文章内容

支持两种写作方式，你可以根据需要选择：

#### 🎯 方法一：使用Frontmatter（推荐）

```markdown
---
title: "深入理解React Hooks"
date: "2025-09-28"
tags: ["React", "JavaScript", "前端", "教程"]
excerpt: "全面解析React Hooks的工作原理和最佳实践"
---

# 深入理解React Hooks

React Hooks是React 16.8引入的新特性，它让我们能在函数组件中使用状态和其他React特性...

## useState Hook

useState是最常用的Hook之一...

```

#### ⚡ 方法二：纯Markdown（自动解析）

```markdown
# Python异步编程实战

在现代Web开发中，异步编程变得越来越重要。Python提供了强大的异步编程支持...

## 什么是异步编程？

异步编程是一种编程范式，它允许程序在等待某些操作完成时继续执行其他任务...

### asyncio基础

```python
import asyncio

async def main():
    print("Hello")
    await asyncio.sleep(1)
    print("World")
```
```

#### 📋 Frontmatter字段说明

| 字段 | 类型 | 必需 | 说明 | 示例 |
|------|------|------|------|------|
| `title` | String | ❌ | 文章标题 | `"React性能优化指南"` |
| `date` | String | ❌ | 发布日期 | `"2025-09-28"` |
| `tags` | Array | ❌ | 文章标签 | `["React", "性能优化"]` |
| `excerpt` | String | ❌ | 文章摘要 | `"详细介绍React应用的性能优化技巧"` |
| `id` | String | ❌ | 自定义ID | `"react-performance-guide"` |

### 3. 更新文章索引

```bash
# 扫描articles目录并生成/更新文章索引
npm run articles:generate
```

### 4. 查看效果

```bash
# 启动开发服务器
npm run dev
```

所有页面会自动显示最新的文章信息！

## 🔄 完整工作流程

### 📝 日常写作流程

```bash
# 🎯 Step 1: 创建文章文件
touch public/articles/react-hooks-guide.md

# ✏️  Step 2: 编写内容
code public/articles/react-hooks-guide.md

# 🤖 Step 3: 生成索引
npm run articles:generate

# 👀 Step 4: 实时预览
npm run dev
```

### 🚀 高效批量管理

```bash
# 📚 添加多篇文章后，一键更新所有索引
npm run articles:generate

# 🔄 边写边看效果（推荐）
npm run articles:watch
```

### 💡 专业写作建议

#### 📁 文件命名规范
```bash
# ✅ 推荐的命名方式
public/articles/react-hooks-complete-guide.md    # 清晰描述内容
public/articles/python-async-programming.md      # 技术相关
public/articles/2025-tech-trends-review.md       # 带日期的文章

# ❌ 避免的命名方式  
public/articles/article1.md                      # 无意义命名
public/articles/我的文章.md                       # 中文文件名
public/articles/new post!.md                     # 特殊字符
```

#### ✍️ 内容结构建议
```markdown
# 主标题 (H1) - 简洁有力

简短的引言段落，概述文章主要内容...

## 核心概念 (H2)

详细解释核心概念...

### 具体实现 (H3)

```language
// 代码示例
function example() {
  // 注释说明
}
```

## 实践应用

实际应用场景和案例...

## 总结

总结要点和关键信息...
```

## 💻 代码块增强功能

### 📋 功能特性

MyBlog支持高级代码块渲染功能，为你的技术文章提供专业的代码展示效果：

✅ **语法高亮** - 支持50+编程语言的语法高亮
✅ **一键复制** - 点击按钮即可复制代码到剪贴板
✅ **语言标签** - 自动显示代码语言标识
✅ **行号显示** - 超过10行的代码自动显示行号
✅ **行高亮** - 支持高亮指定的代码行
✅ **主题适配** - 自动适配Light/Dark主题
✅ **响应式设计** - 移动端友好的滚动和显示

### 🎨 基本用法

#### 标准代码块

````markdown
```javascript
function hello() {
  console.log("Hello World!");
}
```
````

效果：
- 自动语法高亮
- 显示 "JAVASCRIPT" 语言标签
- 右上角显示复制按钮

#### 行内代码

使用单个反引号包裹行内代码：

```markdown
这是一段包含 `const name = "value"` 的行内代码。
```

### 🎯 高级功能

#### 1️⃣ 行高亮

使用 `{行号}` 语法高亮特定行：

````markdown
```javascript{2,4-6}
function calculate(a, b) {
  const sum = a + b;        // 高亮这行
  const product = a * b;
  const difference = a - b;  // 高亮这行
  const quotient = a / b;    // 高亮这行
  const remainder = a % b;   // 高亮这行
  return { sum, product };
}
```
````

**语法规则：**
- `{2}` - 高亮第2行
- `{1,3,5}` - 高亮第1、3、5行
- `{2-5}` - 高亮第2到5行
- `{1,3-5,8}` - 组合使用

#### 2️⃣ 自动行号

代码超过10行时自动显示行号：

````markdown
```python
# 这个代码块有很多行
def fibonacci(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(n - 1):
        a, b = b, a + b
    return b

# 测试函数
for i in range(15):
    print(f"fib({i}) = {fibonacci(i)}")
```
````

### 📚 支持的语言

系统支持所有主流编程语言，以下是常用语言的标识符：

| 语言 | 标识符 | 显示名称 |
|------|--------|----------|
| JavaScript | `js`, `javascript` | JavaScript |
| TypeScript | `ts`, `typescript` | TypeScript |
| Python | `py`, `python` | Python |
| Java | `java` | Java |
| C++ | `cpp`, `c++` | C++ |
| Go | `go` | Go |
| Rust | `rs`, `rust` | Rust |
| HTML | `html` | HTML |
| CSS | `css` | CSS |
| JSON | `json` | JSON |
| Shell | `sh`, `bash`, `shell` | Shell/Bash |
| SQL | `sql` | SQL |
| Markdown | `md`, `markdown` | Markdown |

**完整语言列表**：JavaScript (JSX), TypeScript (TSX), Python, Java, C, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, Dart, HTML, CSS, SCSS, JSON, YAML, Markdown, SQL, Bash, PowerShell, Dockerfile, GraphQL, XML等。

### 🎨 主题适配

代码块会自动适配站点的Light/Dark主题：

- **Light主题** - 使用 One Light 配色方案
- **Dark主题** - 使用 One Dark 配色方案

切换主题时，代码块颜色会实时更新，无需刷新页面。

### 📱 响应式设计

代码块在移动设备上的特殊优化：

- 自动调整字体大小
- 优化的横向滚动
- 精简的工具栏显示
- 移动端复制按钮只显示图标

### ✨ 代码示例

#### Python示例

````markdown
```python{5-8}
import asyncio

async def fetch_data(url):
    print(f"Fetching {url}...")
    await asyncio.sleep(2)
    return f"Data from {url}"

async def main():
    urls = ["api.com/1", "api.com/2", "api.com/3"]
    tasks = [fetch_data(url) for url in urls]
    results = await asyncio.gather(*tasks)
    return results

asyncio.run(main())
```
````

#### React示例

````markdown
```tsx{8-12}
import React, { useState } from 'react';

interface TodoProps {
  initialTodos: string[];
}

const TodoList: React.FC<TodoProps> = ({ initialTodos }) => {
  const [todos, setTodos] = useState(initialTodos);
  const [input, setInput] = useState('');

  const addTodo = () => {
    setTodos([...todos, input]);
    setInput('');
  };

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo, i) => <li key={i}>{todo}</li>)}
      </ul>
    </div>
  );
};
```
````

### 💡 最佳实践

1. **选择正确的语言标识符** - 使用准确的语言标识符以获得最佳的语法高亮效果
2. **合理使用行高亮** - 只高亮关键代码行，避免过度使用
3. **添加注释** - 在复杂代码中添加清晰的注释说明
4. **保持代码简洁** - 单个代码块不要太长，必要时分成多个小块
5. **测试复制功能** - 确保复制的代码可以直接运行

### 🔧 技术实现

代码块功能基于以下技术栈：

- **react-syntax-highlighter** - 核心语法高亮库
- **Prism** - 语法高亮引擎
- **One Dark / One Light** - 主题配色
- **lucide-react** - 复制按钮图标
- **Navigator Clipboard API** - 剪贴板功能

---

## 🎛️ 高级功能

### Frontmatter支持的字段

```yaml
---
id: "custom-article-id"          # 文章ID（可选，默认使用文件名）
title: "文章标题"                 # 文章标题（可选，自动从内容提取）
date: "2025-09-28"               # 发布日期（可选，使用文件修改时间）
tags: ["标签1", "标签2"]          # 文章标签（可选，自动提取）
excerpt: "文章摘要"              # 文章摘要（可选，自动提取）
---
```

### 🏷️ 智能标签系统

系统会自动分析文章内容，智能提取相关标签：

#### 🔧 技术关键词识别
```text
检测技术栈: Python, JavaScript, React, Vue, Node.js, TypeScript...
框架工具: Django, Flask, Express, Webpack, Vite...
语言特性: async/await, Hooks, TypeScript, ES6...
```

#### 📚 内容类型分类
```text
教程类: tutorial, guide, 教程, 指南
评测类: review, comparison, 评测, 对比
API类: api, documentation, 文档
实战类: practice, project, 实战, 项目
```

#### 🎯 文件名智能提取
```bash
# 文件名会影响自动标签提取
react-hooks-tutorial.md     → ["React", "Hooks", "教程"]
python-web-scraping.md      → ["Python", "爬虫", "Web"]
performance-optimization.md → ["性能优化", "优化"]
```

### 📝 自动摘要生成

- **智能截取**: 提取文章前200个有效字符
- **格式清理**: 自动移除Markdown语法标记  
- **段落优化**: 智能处理换行和空格
- **内容过滤**: 排除标题、代码块等干扰内容

#### 摘要生成示例
```markdown
# React性能优化实战

在现代Web应用开发中，性能优化是一个至关重要的话题。本文将深入探讨React应用的性能优化策略...

```
👆 生成的摘要：`"在现代Web应用开发中，性能优化是一个至关重要的话题。本文将深入探讨React应用的性能优化策略，包括组件渲染优化、状态管理优化、以及打包优化等方面的内容..."`

## 📁 文件结构

```
public/
├── articles/              # 文章目录
│   ├── article1.md       # 文章文件
│   ├── article2.md
│   └── ...
└── articles.json         # 自动生成的文章索引

scripts/
└── generate-articles.js  # 文章生成脚本
```

## 🔧 命令参考

| 命令 | 功能 |
|------|------|
| `npm run articles:generate` | 扫描文章目录并生成索引 |
| `npm run articles:watch` | 生成索引并启动开发服务器 |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |

## 🎯 最佳实践

### 1. 文件命名

- 使用小写字母和连字符：`my-new-article.md`
- 避免空格和特殊字符
- 描述性的文件名有助于自动标签提取

### 2. 内容结构

```markdown
# 主标题

简短的介绍段落...

## 二级标题

内容...

### 三级标题

更多内容...
```

### 3. 标签策略

- 使用通用的技术标签：`Python`、`React`、`AI`
- 添加内容类型标签：`教程`、`评测`、`指南`
- 保持标签简洁和一致

### 4. 发布流程

1. **本地编辑**：在本地编辑器中写作
2. **生成索引**：运行 `npm run articles:generate`
3. **本地预览**：运行 `npm run dev` 预览效果
4. **推送发布**：提交到Git仓库，自动部署

## 🔧 故障排除指南

### 🚨 文章显示问题

#### ❌ 问题：文章没有显示在列表中
```bash
# 🔍 排查步骤：
1. 检查文件位置是否正确
   ls public/articles/          # 应该能看到你的.md文件

2. 检查文件扩展名
   file public/articles/your-article.md  # 应该显示text类型

3. 重新生成索引
   npm run articles:generate

4. 检查文章索引文件
   cat public/articles.json     # 查看生成的索引是否包含你的文章

5. 查看控制台错误
   # 在浏览器开发者工具中检查是否有错误信息
```

#### ❌ 问题：文章内容无法加载
```bash
# 🔍 可能原因：
1. Markdown语法错误      → 检查frontmatter格式
2. 文件编码问题         → 确保使用UTF-8编码
3. 文件权限问题         → 检查文件是否可读
4. 路径配置错误         → 检查vite.config.ts中的base配置
```

### 🔄 文章排序问题

#### ❌ 问题：文章顺序不正确
```yaml
# ✅ 解决方案：在frontmatter中指定日期
---
title: "我的文章"
date: "2025-09-28"        # 使用YYYY-MM-DD格式
---
```

```bash
# 📊 排序规则说明：
1. 优先使用frontmatter中的date字段
2. 其次使用文件修改时间
3. 最后使用文件创建时间
4. 按日期倒序排列（最新的在前）
```

### 🏷️ 标签相关问题  

#### ❌ 问题：标签显示不正确或缺失
```yaml
# ✅ 手动指定标签（推荐）
---
tags: ["React", "JavaScript", "前端", "教程"]
---
```

```bash
# 🤖 自动标签提取优化技巧：
1. 在文章中多次提及关键技术栈名称
2. 使用标准的技术术语（如JavaScript而非JS）
3. 在文件名中包含关键词
4. 重新运行生成命令: npm run articles:generate
```

### 📝 摘要生成问题

#### ❌ 问题：摘要太长/太短/不准确
```yaml
# ✅ 手动指定摘要
---
excerpt: "这是一篇关于React Hooks的详细教程，包含实际示例和最佳实践。"
---
```

```markdown
# 📝 自动摘要优化技巧：
1. 在文章开头写一段简洁的介绍
2. 避免在开头使用大段代码
3. 第一段应该概括文章主要内容
4. 避免在开头使用图片或链接
```

### 🚀 性能相关问题

#### ❌ 问题：文章生成速度慢
```bash
# 🔍 优化建议：
1. 减少同时处理的文章数量
2. 优化文章内容大小
3. 使用增量生成（仅处理修改的文章）

# 🛠️ 调试命令：
npm run articles:generate --verbose    # 显示详细日志
```

### 🌐 部署相关问题

#### ❌ 问题：部署后文章无法访问
```bash
# 🔍 检查清单：
1. 确保articles.json已生成并推送到仓库
2. 检查GitHub Actions是否成功运行
3. 确保vite.config.ts中的base路径配置正确
4. 检查.gitignore是否误排除了articles相关文件
```

## 🚀 自动化部署

### GitHub Actions集成

当你推送代码到GitHub仓库时，系统会自动：

```yaml
# .github/workflows/deploy.yml 
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Generate articles index    # 🤖 自动生成文章索引
      run: npm run articles:generate
      
    - name: Build project              # 🏗️ 构建项目
      run: npm run build
      
    - name: Deploy to Pages           # 🚀 部署到GitHub Pages
      uses: actions/deploy-pages@v2
```

### 📊 部署状态检查

```bash
# 查看部署状态
1. 进入GitHub仓库页面
2. 点击Actions标签页
3. 查看最新的workflow运行状态
4. 检查是否有错误信息
```

### 🔧 部署故障排除

| 错误类型 | 可能原因 | 解决方案 |
|---------|---------|---------|
| 文章生成失败 | Markdown语法错误 | 检查frontmatter格式 |
| 构建失败 | 依赖问题 | 检查package.json |
| 部署失败 | 权限问题 | 检查仓库Pages设置 |

## 🎯 最佳实践总结

### ✅ 推荐的工作流程
1. **📝 专注写作** - 使用你喜欢的编辑器
2. **🏷️ 合理标签** - 手动指定重要标签
3. **📊 定期生成** - 运行 `npm run articles:generate`
4. **👀 本地预览** - 使用 `npm run dev` 验证效果
5. **🚀 推送发布** - Git提交并推送到远程仓库

### 📋 质量检查清单
- [ ] 文章标题简洁明了
- [ ] 摘要准确概括内容
- [ ] 标签相关且有用
- [ ] 文件命名规范
- [ ] Markdown语法正确
- [ ] 代码示例完整
- [ ] 链接和图片有效

---

## 🎉 开始你的写作之旅！

现在你已经掌握了MyBlog文章管理系统的所有功能，可以专注于内容创作了。系统会自动处理所有技术细节，让你的想法快速呈现给读者！

**需要帮助？** 查看其他文档：
- 📚 [项目README](../README.md)
- 🚀 [部署指南](./DEPLOYMENT.md)
- 💻 [开发指南](./DEVELOPMENT.md)
