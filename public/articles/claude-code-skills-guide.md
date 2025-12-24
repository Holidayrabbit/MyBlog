---
title: "Claude Code Skills 使用指南"
date: "2025-12-24"
tags: ["Claude Code", "AI", "开发工具", "Skills"]
excerpt: "全面介绍 Claude Code 中的 Skill 功能：如何使用、创建和分享技能扩展，让 AI 编程助手更懂你的需求。"
---

# Claude Code Skills 使用指南：让 AI 编程助手真正懂你

如果你已经用过 Claude Code 写代码，可能会遇到这样的困扰：

- 让它设计前端界面，总是千篇一律的 Inter 字体 + 紫色渐变背景；
- 想用团队的特定技术栈（比如 shadcn/ui + Tailwind），每次都要在对话里重复说明；
- 生成的代码太保守、太通用，缺少你项目里特有的风格和约定。

这些问题的根源在于：**AI 模型倾向于生成"训练数据中最常见的答案"**，而不是你真正想要的那个。

好消息是，Claude Code 提供了一个叫 **"Skill"** 的功能，可以让 AI 在特定场景下自动切换到"专家模式"。就像游戏角色的技能树一样，需要时自动激活，不需要时不占用资源。

这篇文章会系统地讲清楚：

- **Skill 到底是什么？它解决了什么问题？**
- **如何使用现有的 Skill？有哪些可用的 Skill？**
- **一个真实案例：Skill 如何改变前端设计质量**
- **如何创建自己的 Skill？**

读完之后，你应该能够：

1. 熟练使用 Claude Code 的各种内置 Skill；
2. 理解 Skill 的工作原理和最佳实践；
3. 为自己的团队创建定制化的 Skill。

---

## 一、Skill 是什么

### 1.1 基本概念

Skill 是 Claude Code 的一种**模块化能力扩展包**。它本质上是一个包含特定领域知识的文档，在需要时动态加载给 AI 模型。

用一个类比来理解：

- **传统做法**：把所有指令塞进系统提示词，就像背着一个巨大的背包，里面装着你可能用到的所有东西，沉重且低效；
- **Skill 机制**：把不同领域的知识做成模块，需要时才拿出来用，就像游戏里的技能书，用时激活，不用时不占内存。

### 1.2 核心特性

Skill 有三个关键特性：

| 特性 | 说明 | 好处 |
|------|------|------|
| **模型自主调用** | Claude 会根据任务描述自动判断是否需要使用某个 Skill | 无需手动切换，更智能 |
| **按需加载** | 只有使用时才加载到上下文中 | 不浪费 token，保持响应速度 |
| **结构化知识** | 通过 SKILL.md 文件定义，格式统一 | 易于编写、维护和分享 |

### 1.3 与传统 Prompt 的区别

如果把它们做个对比：

```text
传统 System Prompt：
- 全局生效，始终占用上下文
- 不同任务混在一起，容易冲突
- 难以复用和分享

Skill 机制：
- 按需激活，上下文利用率高
- 每个 Skill 专注一个领域
- 可以跨项目、跨团队复用
```

举个例子：如果你的项目需要遵守特定的代码规范、使用特定的工具链，传统做法是在每次对话开始时复制粘贴一长段说明。而有了 Skill，你只需要创建一次，之后 Claude 会在需要时自动参考这些规范。

---

## 二、Skill 的三种类型

Claude Code 支持三种类型的 Skill，它们的作用范围和使用场景各不相同：

| 类型 | 存储路径 | 适用场景 | 共享方式 |
|------|---------|---------|---------|
| **个人 Skill** | `~/.claude/skills/` | 个人工作流、实验性功能 | 不共享，仅本机可用 |
| **项目 Skill** | `.claude/skills/` | 团队协作、项目特定工具 | 通过 Git 自动同步给团队 |
| **插件 Skill** | 由插件提供 | 通用能力（如文档处理） | 安装插件后自动可用 |

### 2.1 个人 Skill

存放在你的用户目录下（`~/.claude/skills/`），只有你自己能用。适合：

- 个人偏好的代码风格
- 正在实验的新工作流
- 不想公开的私有知识库

例如，你可以创建一个 `my-coding-style` Skill，包含你个人喜欢的命名规范、注释风格等。

### 2.2 项目 Skill

存放在项目根目录下（`.claude/skills/`），可以通过 Git 提交到仓库。适合：

- 团队共同遵守的代码规范
- 项目特定的技术栈说明
- 公司的设计系统和组件库

这是最常用的类型。当团队成员克隆项目后，所有项目 Skill 都会自动生效，无需额外配置。

### 2.3 插件 Skill

由 Claude Code 的官方或第三方插件提供。目前最常见的是**文档处理类 Skill**：

- `document-skills:xlsx` - 电子表格创建、编辑和分析
- `document-skills:docx` - Word 文档处理
- `document-skills:pptx` - PowerPoint 演示文稿
- `document-skills:pdf` - PDF 文档操作

这些 Skill 在你安装对应插件后会自动可用，不需要手动创建。

---

## 三、为什么需要 Skill

### 3.1 解决的核心问题

Skill 机制主要解决三个痛点：

**痛点 1：避免重复指令**

以前，如果你想让 Claude 使用特定的 UI 库，每次对话都得说：

```
"请用 shadcn/ui 和 Tailwind CSS，颜色用我们的品牌色 #2563eb..."
```

有了项目 Skill，这些信息写一次，Claude 会在需要时自动参考。

**痛点 2：突破"平均水平陷阱"**

AI 模型有一个技术问题叫 **"distributional convergence"**（分布中心化）：它倾向于生成训练数据中最常见的答案。

结果就是：
- 前端设计总是 Inter 字体 + 紫色渐变
- 代码结构总是最保守的模式
- 很难生成"有个性"的内容

Skill 通过注入**具体的、反常规的指导**，帮助 AI 跳出这个陷阱。

**痛点 3：团队知识固化与传承**

团队积累的最佳实践，以前只能靠文档和口口相传。新人要花很长时间才能掌握。

有了 Skill，这些知识可以：
- 编码成结构化文档
- 自动在 AI 生成代码时生效
- 通过 Git 版本控制和演进

### 3.2 技术原理简述

从技术角度看，Skill 做的事情很简单：

1. 你定义了一个包含专业知识的文档（SKILL.md）；
2. 在文档开头用 YAML 描述这个 Skill 的名称和适用场景；
3. Claude 在接收任务时，根据任务描述判断是否需要加载某个 Skill；
4. 如果需要，就把 Skill 的内容临时加入上下文窗口。

这样做的好处是：
- **上下文利用率高**：不需要的知识不会占用 token；
- **可解释性强**：你知道 AI 参考了哪些知识；
- **易于迭代**：修改 Skill 比调整系统提示词简单得多。

---

## 四、如何使用现有的 Skill

这是本文的重点部分。我们从"查看可用 Skill"开始，逐步深入到实际使用。

### 4.1 查看可用的 Skill

有两种方法可以查看当前环境中有哪些 Skill：

**方法 1：询问 Claude**

最简单的方式是直接问：

```
What skills are available?
```

或者用中文：

```
有哪些可用的 Skill？
```

Claude 会列出所有可用的 Skill，包括个人、项目和插件 Skill。

**方法 2：查看文件系统**

如果你想直接查看 Skill 文件：

```bash
# 查看个人 Skills
ls -la ~/.claude/skills/

# 查看项目 Skills（在项目根目录下）
ls -la .claude/skills/
```

每个 Skill 是一个目录，里面至少包含一个 `SKILL.md` 文件。

### 4.2 使用 Skill 的两种方式

#### 方式一：显式调用

你可以在对话中明确要求使用某个 Skill：

```
请使用 frontend-design skill 创建一个 SaaS 产品的落地页
```

```
Use the xlsx skill to analyze this sales data
```

这种方式适合：
- 你明确知道要用哪个 Skill
- 想要覆盖 Claude 的自动判断
- 测试 Skill 是否正常工作

#### 方式二：自动激活

更常见的情况是，你正常描述任务，Claude 会根据 Skill 的 description 字段自动判断是否需要激活。

例如，如果你有一个 frontend-design Skill，它的 description 是：

```yaml
description: 为前端项目提供设计指导，避免通用风格，使用现代字体和独特配色
```

那么当你说：

```
帮我设计一个博客首页
```

Claude 会自动激活这个 Skill，按照里面的指导来生成设计。

**判断 Skill 是否被激活**

Claude 通常会在回复中提示，例如：

```
我将使用 frontend-design skill 来创建这个页面...
```

如果你没有看到类似提示，可能是因为：
1. Skill 的 description 不够具体
2. 任务描述和 Skill 的适用场景不匹配
3. Skill 文件有语法错误

### 4.3 使用文档处理 Skill

文档处理是 Claude Code 内置的非常实用的功能。以 xlsx Skill 为例：

**场景 1：创建电子表格**

```
创建一个销售数据分析表，包含：
- 月份、销售额、成本、利润
- 自动计算利润率
- 添加条件格式高亮异常数据
```

Claude 会使用 xlsx Skill 生成一个完整的 .xlsx 文件，包含公式和格式。

**场景 2：分析现有数据**

```
分析 sales-2024.xlsx 文件，总结：
1. 每个季度的销售趋势
2. 哪个产品线表现最好
3. 给出优化建议
```

**场景 3：批量处理**

```
读取 data/ 目录下所有 CSV 文件，合并成一个 Excel 工作簿，每个 CSV 作为一个工作表
```

类似的，docx、pptx、pdf Skill 也可以处理各自格式的文档。这些 Skill 的强大之处在于：
- 保留原有格式
- 支持复杂的文档结构
- 可以批量操作

---

## 五、实战案例：前端设计 Skill

现在让我们看一个真实的案例，了解 Skill 如何显著改善输出质量。这个案例来自 Claude 官方博客的分享。

### 5.1 问题：千篇一律的设计

在没有 Skill 的情况下，让 Claude 设计前端界面时会遇到这个问题：

**无 Skill 时的典型输出**：
- 字体：Inter 或 Roboto（最常见的 Web 字体）
- 配色：紫色渐变 (#667eea → #764ba2)
- 布局：居中对齐，最小化动画
- 背景：纯色或简单线性渐变

虽然这些设计不难看，但毫无特色。更重要的是，**无论你做什么类型的产品，生成的设计都很相似**。

### 5.2 解决方案：frontend-aesthetics Skill

Claude 团队创建了一个约 400 tokens 的 Skill，针对四个维度提供具体指导：

| 维度 | 传统做法 | Skill 指导 |
|------|---------|-----------|
| **排版** | Arial、Roboto、Inter | 避开这些，用 Playfair Display、Space Grotesk、JetBrains Mono 等有特色的字体 |
| **配色** | 随机选择，颜色分布均匀 | 使用 CSS 变量确保一致性，采用"主色 + 强对比重音色"而非多色均衡 |
| **动画** | 散布的微交互 | 优先 CSS 方案，在关键时刻使用阶段式动画，而非到处都动 |
| **背景** | 纯色或简单渐变 | 分层 CSS 渐变 + 几何图案，创造深度感 |

关键的一点是，Skill 中包含了一句重要提醒：

```
"思维跳出框架，避免收敛到新的常见选择"
```

这句话提醒 AI：不要用 Inter 换成 Space Grotesk 后就停止思考，要真正为每个项目选择合适的风格。

### 5.3 效果对比

让我们看三个实际案例：

**案例 1：SaaS 产品落地页**

- **无 Skill**：
  - 字体：Inter
  - 配色：紫色渐变背景
  - 布局：标准的 Hero Section + Features Grid

- **有 Skill**：
  - 字体：Playfair Display（标题）+ Inter（正文）
  - 配色：深蓝主色 (#0f172a) + 青色重音 (#06b6d4)
  - 背景：分层渐变 + 网格图案
  - 动画：Hero 区域的淡入效果，其他部分静态

**案例 2：创意工作室网站**

- **无 Skill**：
  - 布局：传统的顶部导航 + 内容区
  - 风格：最小化、保守

- **有 Skill**：
  - 字体：Editorial serif（大标题）+ Mono（代码感设计）
  - 配色：黑白为主 + 亮黄重音
  - 布局：不对称网格，打破常规
  - 细节：鼠标悬停的色彩反转效果

**案例 3：数据可视化仪表板**

- **无 Skill**：
  - 风格：浅色主题，平面设计
  - 字体：系统默认字体

- **有 Skill**：
  - 风格：深色主题，有层次感
  - 字体：JetBrains Mono（代码和数字）
  - 配色：科技蓝 + 数据可视化色板
  - 动画：图表数据的阶段式加载

### 5.4 关键洞察

这个案例给我们几个重要启发：

1. **Skill 的价值不在于"禁止使用 X"，而在于"提供替代思路"**
   不是说"不要用 Inter"，而是说"考虑用这些更有特色的字体"。

2. **提示的粒度很重要**
   - 太具体（"用 #2563eb 这个颜色"）→ 失去灵活性
   - 太模糊（"用好看的颜色"）→ 没有指导作用
   - 刚刚好（"主色 + 强对比重音，避免多色均衡"）→ 既有原则又有自由度

3. **Skill 可以对抗模型的"惰性"**
   模型自然倾向于选择"安全的中间选项"，Skill 通过明确的反常规指导，推动它做出更有个性的选择。

---

## 六、如何创建自己的 Skill

现在到了实践部分。虽然本文重点是"如何使用"，但了解创建过程有助于更好地理解 Skill 的工作原理。

### 6.1 Skill 的文件结构

一个 Skill 的标准结构如下：

```
my-skill-name/
├── SKILL.md          # 核心文件（必需）
├── reference.md      # 参考文档（可选）
└── scripts/          # 辅助脚本（可选）
```

最简单的 Skill 只需要一个 `SKILL.md` 文件。

### 6.2 SKILL.md 的基本格式

一个完整的 SKILL.md 文件包含两部分：**YAML 前言**和**正文内容**。

```yaml
---
name: my-frontend-style
description: 为前端项目应用公司设计规范，使用 Tailwind CSS 和 shadcn/ui 组件库
allowed-tools: Read, Write, Bash
---

# 公司前端设计规范

## 技术栈

所有前端项目统一使用：
- **样式方案**：Tailwind CSS
- **组件库**：shadcn/ui
- **字体**：主标题用 Inter Bold，正文用 Inter Regular

## 颜色规范

使用以下品牌色：

css
:root {
  --primary: #2563eb;      /* 主色：品牌蓝 */
  --secondary: #64748b;    /* 辅助色：灰蓝 */
  --accent: #f59e0b;       /* 强调色：琥珀色 */
}


## 布局原则

1. 移动优先：先设计移动端，再适配桌面端
2. 间距统一：使用 Tailwind 的 spacing scale（4px 倍数）
3. 最大内容宽度：1280px

## 组件使用规范

- 按钮：优先使用 shadcn/ui 的 Button 组件
- 表单：使用 Form + Input 组件，配合 react-hook-form
- 对话框：使用 Dialog 组件，避免原生 alert

## 代码风格

- 组件文件名：PascalCase（如 UserProfile.tsx）
- 工具函数：camelCase（如 formatDate.ts）
- 常量：UPPER_SNAKE_CASE（如 API_BASE_URL）
```

### 6.3 关键字段说明

YAML 前言中的三个字段：

**1. name**（必需）

- 命名规则：只能包含小写字母、数字和连字符
- 长度限制：最多 64 字符
- 举例：`frontend-design`、`company-coding-style`、`react-best-practices`

**2. description**（必需）

- 作用：让 Claude 判断什么时候应该使用这个 Skill
- 长度限制：最多 1024 字符
- 写作技巧：
  - 说明适用场景（"当用户要求创建前端界面时..."）
  - 说明核心能力（"提供设计指导，使用 Tailwind CSS..."）
  - 包含关键词（"前端"、"设计"、"React"等）

**坏的 description**：
```yaml
description: 一些前端相关的东西
```
太模糊，Claude 无法判断何时使用。

**好的 description**：
```yaml
description: 为 React 前端项目提供设计和代码规范指导，强制使用 Tailwind CSS 和 shadcn/ui 组件库，遵守公司品牌色和排版规范
```

**3. allowed-tools**（可选）

- 作用：限制 Claude 在使用这个 Skill 时可以调用哪些工具
- 使用场景：
  - 只读操作：`allowed-tools: Read, Grep, Glob`
  - 安全敏感任务：只允许特定工具
  - 防止误操作：禁止文件写入等

示例：

```yaml
# 只允许读取和搜索，不允许修改文件
allowed-tools: Read, Grep, Glob

# 允许读写和运行命令
allowed-tools: Read, Write, Bash

# 不限制（默认）
# 不写这个字段即可
```

### 6.4 创建第一个 Skill：快速上手

让我们创建一个简单但实用的 Skill：团队的 Git 提交规范。

**步骤 1：创建 Skill 目录**

```bash
# 创建项目 Skill（如果是团队使用）
mkdir -p .claude/skills/git-commit-style

# 或者创建个人 Skill（如果只是自己用）
mkdir -p ~/.claude/skills/git-commit-style
```

**步骤 2：创建 SKILL.md 文件**

```bash
# 进入 Skill 目录
cd .claude/skills/git-commit-style

# 创建 SKILL.md
touch SKILL.md
```

**步骤 3：编写内容**

```yaml
---
name: git-commit-style
description: 规范 Git 提交信息格式，使用约定式提交（Conventional Commits）规范
---

# Git 提交信息规范

本项目使用 [约定式提交](https://www.conventionalcommits.org/) 规范。

## 提交信息格式

<类型>(<范围>): <简短描述>
<详细描述>（可选）
<页脚>（可选）

## 类型（type）

必须是以下之一：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档修改
- `style`: 代码格式（不影响功能）
- `refactor`: 重构（既不是新功能也不是修复）
- `test`: 添加或修改测试
- `chore`: 构建过程或辅助工具的变动

## 范围（scope）

可选，表示影响的模块，例如：

- `auth`: 认证模块
- `api`: API 接口
- `ui`: 用户界面
- `db`: 数据库

## 示例

bash
# 好的提交
feat(auth): 添加 OAuth 2.0 登录支持
fix(api): 修复用户列表分页错误
docs(readme): 更新安装说明

# 不好的提交
update code
fix bug
修改了一些东西

## 工具

项目已配置 commitlint，不符合规范的提交会被拒绝。
```

**步骤 4：测试 Skill**

创建完成后，在 Claude Code 中测试：

```
帮我创建一个 Git 提交，我刚刚修复了登录页面的表单验证问题
```

如果 Skill 生效，Claude 应该会生成符合规范的提交信息：

```bash
git commit -m "fix(auth): 修复登录表单验证逻辑"
```

### 6.5 调试常见问题

如果 Skill 没有被激活，检查以下几点：

**问题 1：description 不够具体**

```yaml
# ❌ 太模糊
description: 一些编码规范

# ✅ 具体明确
description: 为 TypeScript 项目提供编码规范，包括命名约定、注释风格和错误处理模式
```

**问题 2：YAML 语法错误**

常见错误：
- 使用了 Tab 而不是空格（YAML 不允许 Tab）
- 冒号后面没有空格
- 字符串包含特殊字符但没有用引号

**问题 3：文件路径错误**

确保：
- 个人 Skill 在 `~/.claude/skills/`
- 项目 Skill 在 `.claude/skills/`（注意开头的点）
- 每个 Skill 是一个独立的目录

**问题 4：任务描述不匹配**

如果你创建了一个前端设计 Skill，但用户说"帮我写一个 Python 脚本"，那么这个 Skill 不会被激活。这是正常的。

---

## 七、最佳实践与进阶技巧

### 7.1 编写高质量 Skill 的原则

**原则 1：保持专注**

一个 Skill 应该只处理一个领域或任务类型。

```
# ❌ 不好：什么都想管
name: everything-i-need
description: 包含前端设计、后端开发、数据库设计、DevOps 等所有内容

# ✅ 好：专注一个领域
name: frontend-design
description: 为前端界面提供设计指导，包括排版、配色和动画
```

**原则 2：提供具体示例**

不要只说"应该"或"不应该"，而要给出具体例子。

```markdown
# ❌ 不好
使用好的命名

# ✅ 好
## 命名规范

变量名使用 camelCase：
- ✅ `userName`, `isLoading`, `fetchUserData`
- ❌ `user_name`, `IsLoading`, `fetch_user_data`

常量使用 UPPER_SNAKE_CASE：
- ✅ `API_BASE_URL`, `MAX_RETRY_COUNT`
- ❌ `apiBaseUrl`, `maxRetryCount`
```

**原则 3：平衡原则与灵活性**

给出指导，但不要过于死板。

```markdown
# ❌ 太死板
所有按钮必须使用 #2563eb 这个颜色

# ✅ 更好
主按钮使用品牌主色（见 CSS 变量 --primary），次要按钮使用灰色调
```

### 7.2 团队协作技巧

**技巧 1：在项目 README 中说明 Skills**

在项目的 README.md 中添加一个章节：

```markdown
## Claude Code Skills

本项目包含以下自定义 Skills：

- `frontend-design`: 前端设计规范
- `git-commit-style`: Git 提交信息规范
- `api-conventions`: API 接口设计约定

这些 Skills 会在使用 Claude Code 时自动生效。
```

**技巧 2：版本控制 Skills**

就像管理代码一样管理 Skills：

```bash
# 提交 Skill 变更
git add .claude/skills/
git commit -m "docs(skills): 更新前端设计规范，添加新的颜色变量"
```

**技巧 3：定期审查和更新**

随着项目演进，Skill 也需要更新：
- 技术栈变化时（比如从 Redux 迁移到 Zustand）
- 设计系统更新时
- 团队积累了新的最佳实践时

### 7.3 性能优化

**技巧 1：控制 Skill 大小**

虽然没有严格的大小限制，但建议：
- 核心 Skill：200-500 tokens
- 详细 Skill：500-1000 tokens
- 如果超过 1000 tokens，考虑拆分或使用 reference.md

**技巧 2：使用 reference.md 存储大量参考资料**

```
my-skill/
├── SKILL.md         # 核心指导（500 tokens）
└── reference.md     # 详细示例和参考（2000 tokens）
```

Claude 会优先加载 SKILL.md，需要更多细节时才读取 reference.md。

**技巧 3：避免重复信息**

不要在多个 Skills 中重复相同的内容。如果有通用规范，创建一个基础 Skill，其他 Skill 引用它。

---

## 八、总结与延伸

让我们回顾一下本文的核心要点：

### 8.1 核心收获

1. **Skill 是 Claude Code 的能力扩展机制**
   通过模块化的知识文档，让 AI 在特定场景下更专业、更符合你的需求。

2. **三种类型的 Skill 各有用途**
   - 个人 Skill：你的个性化工作流
   - 项目 Skill：团队的共同规范
   - 插件 Skill：通用的专业能力

3. **使用 Skill 比创建 Skill 更常见**
   大部分情况下，你会使用已有的 Skill。只有当确实需要定制化时，才需要创建新的。

4. **好的 Skill 要平衡具体性和灵活性**
   既要给出明确的指导，又要留给 AI 足够的发挥空间。

### 8.2 学习路径建议

如果你想深入掌握 Skill 的使用，建议按以下步骤进行：

**第 1 周：熟悉现有 Skills**
- 探索 Claude Code 内置的插件 Skills（docx、xlsx、pdf 等）
- 在日常工作中有意识地使用它们
- 观察 Claude 何时自动激活 Skills

**第 2 周：创建第一个简单 Skill**
- 选择一个小场景（比如 Git 提交规范）
- 创建并测试
- 根据效果迭代改进

**第 3 周：创建团队 Skill**
- 识别团队中最常重复的指令
- 创建项目 Skill
- 收集团队反馈并优化

**第 4 周：探索高级用法**
- 尝试组合多个 Skills
- 使用 allowed-tools 控制权限
- 创建包含 scripts/ 的复杂 Skill

### 8.3 相关资源

- [Claude Code 官方文档](https://code.claude.com/docs)
- [Skills 详细说明](https://code.claude.com/docs/en/skills)
- [Conventional Commits 规范](https://www.conventionalcommits.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

### 8.4 最后的建议

Skill 机制的核心价值在于：**让 AI 从"通用助手"变成"你的专属助手"**。

刚开始时，不要追求完美。创建一个简单的 Skill，使用它，根据反馈改进。随着时间推移，你会积累出一套适合自己或团队的 Skill 库。

最重要的是：**把你在日常工作中重复给 AI 的指令，转化成 Skill**。这样既能提高效率，又能保证一致性。

希望这篇文章能帮助你更好地使用 Claude Code。如果你有任何问题或经验分享，欢迎在评论区讨论。
