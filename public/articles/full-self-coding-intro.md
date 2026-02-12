---
title: "Full Self Coding：让100个AI Agent并行为你写代码"
date: "2026-02-12"
tags: ["开源", "Docker", "Agent"]
excerpt: "无需提示词、无需指令、无需计划，让100~1000个AI代理并行工作，自动解决代码库中的所有问题"
---

# Full Self Coding：让100个AI Agent并行为你写代码

## 引言

想象一下，当你打开一个复杂的代码库时，不需要编写任何提示词，不需要制定详细的计划，只需要一个命令，就能让数百个AI代理同时开始工作，自动发现并解决代码中的各种问题——这就是 **Full Self Coding (FSC)** 项目的愿景。

在传统的AI辅助编程中，我们通常需要：
- 精心设计提示词
- 明确指定要修改的文件
- 逐个处理问题
- 手动协调多个任务

而 FSC 彻底改变了这一模式，它通过智能分析、任务分解和并行执行，实现了真正的"全自动编码"。

## 项目概述

Full Self Coding 是一个创新的自动化软件工程框架，它将多个AI代理（如 Claude Code、Gemini CLI）集成到 Docker 容器中，通过智能代码库分析、任务分解和并行执行，实现大规模自动化代码修改。

### 核心理念

**"No prompts, no instructions, no plans"** —— 这是 FSC 的核心理念。项目通过以下方式实现这一目标：

1. **自动分析**：智能扫描代码库，自动识别潜在问题和改进点
2. **任务分解**：将复杂的代码库问题分解为独立的小任务
3. **并行执行**：在隔离的 Docker 容器中并行运行多个 AI 代理
4. **结果聚合**：自动收集所有修改，生成统一的执行报告

### 主要特性

- **🤖 多代理支持**：集成 Claude Code、Gemini CLI，支持扩展更多 AI 代理
- **📦 容器化执行**：每个任务在独立的 Docker 容器中运行，确保安全隔离
- **🔍 智能分析**：自动分析代码库结构，识别问题和改进机会
- **⚙️ 灵活配置**：分层配置系统，支持环境变量、项目配置和全局配置
- **📊 详细报告**：生成包含 git diff 的完整执行报告
- **🔄 并行处理**：支持同时运行多个容器，最大化执行效率
- **🛡️ 错误恢复**：完善的错误处理和优雅降级机制

## 架构设计

FSC 采用模块化架构，核心组件包括：

### 核心模块

1. **ConfigReader（配置管理器）**
   - 负责读取和合并多层配置
   - 支持环境变量、项目配置、全局配置
   - 提供配置验证和默认值处理

2. **Analyzer（代码分析器）**
   - 扫描代码库结构
   - 识别潜在问题和改进点
   - 生成任务列表

3. **TaskSolverManager（任务管理器）**
   - 管理任务队列
   - 协调并行执行
   - 控制资源使用

4. **DockerInstance（容器管理器）**
   - 创建和管理 Docker 容器
   - 处理文件传输
   - 执行命令并监控输出

5. **TaskSolver（任务执行器）**
   - 在容器中执行单个任务
   - 调用 AI 代理进行代码分析和修改
   - 收集执行结果

6. **CodeCommitter（代码提交器）**
   - 收集所有修改
   - 生成 git diff
   - 创建执行报告

## 工作流程

FSC 的完整工作流程如下图所示：

![Full Self Coding 工作流程](/MyBlog/images/full-self-coding/workflow.png)

### 详细流程说明

**1. 启动与配置（Steps 1-3）**

用户通过 CLI 启动 FSC，系统按照以下优先级读取配置：
- 环境变量（`FSC_*`）
- 项目配置（`.fsc/config.json`）
- 全局配置（`~/.config/full-self-coding/config.json`）
- 默认值

配置项包括：
- AI 代理类型（Claude Code / Gemini CLI）
- Docker 资源限制（内存、CPU、超时时间）
- 任务数量范围（最小/最大任务数）
- 工作风格和编码风格

**2. 代码库分析（Steps 4-5）**

Analyzer 模块会：
- 克隆或读取目标代码库
- 分析项目结构和依赖关系
- 识别代码质量问题（如重复代码、复杂度过高等）
- 发现潜在的 bug 和安全隐患
- 生成优先级排序的任务列表

**3. 任务管理与分发（Steps 6-7）**

TaskSolverManager 负责：
- 维护任务队列
- 根据配置控制并行度（如最多同时运行 3 个容器）
- 为每个任务分配独立的 Docker 容器
- 监控资源使用情况

**4. 并行执行（Steps 8-11）**

这是 FSC 最核心的部分，体现了"并行"的威力：

```
任务队列 → Docker容器1 → AI代理 → 代码分析 → 代码修改
         → Docker容器2 → AI代理 → 代码分析 → 代码修改
         → Docker容器3 → AI代理 → 代码分析 → 代码修改
         → ...
```

每个容器中：
- 安装必要的依赖（如 Claude Code CLI）
- 克隆代码库
- 执行 AI 代理命令
- AI 代理自主分析代码并进行修改
- 记录所有操作日志

**5. 结果收集与报告（Steps 12-14）**

所有任务完成后：
- 从每个容器中提取修改后的代码
- 生成 git diff 对比
- 统计修改的文件数、行数
- 记录成功/失败的任务
- 生成 Markdown 格式的执行报告

**6. 可选提交（Steps 15-17）**

根据配置或用户选择：
- 自动提交所有修改
- 或仅生成报告供人工审查

## 技术亮点

### 1. 容器隔离与安全

每个任务在独立的 Docker 容器中运行，带来以下优势：

- **安全性**：AI 代理的操作完全隔离，不会影响宿主机
- **一致性**：所有任务在相同的环境中执行
- **可控性**：可以设置内存、CPU 限制，防止资源耗尽
- **可恢复性**：单个任务失败不影响其他任务

```typescript
// Docker 容器配置示例
{
  "dockerMemoryMB": 2048,      // 内存限制 2GB
  "dockerCpuCores": 2,         // CPU 核心数
  "dockerTimeoutSeconds": 600, // 超时时间 10 分钟
  "dockerImageRef": "node:latest"
}
```

### 2. 智能任务分解

Analyzer 使用 AI 能力进行代码库分析，能够：

- 理解项目结构和架构模式
- 识别代码异味（Code Smells）
- 发现重复代码和可重构的部分
- 检测潜在的性能问题
- 生成合理的任务优先级

### 3. 灵活的配置系统

FSC 提供了强大的配置系统，支持：

**工作风格（Work Style）**：
- `default`：标准工作模式
- `bold_genius`：大胆创新，快速原型
- `careful`：谨慎保守，注重稳定性
- `agile`：敏捷迭代
- `research`：研究探索

**编码风格级别（0-10）**：
- 0-3：简洁优先，最小化代码
- 4-6：平衡可读性和简洁性
- 7-10：企业级标准，完整文档

**自定义风格**：
```json
{
  "customizedWorkStyle": "Focus on rapid prototyping and innovation",
  "customizedCodingStyle": "Follow enterprise coding standards with comprehensive documentation"
}
```

### 4. 多代理支持

FSC 设计了统一的代理接口，目前支持：

| 代理类型 | 特点 | 适用场景 |
|---------|------|---------|
| **Claude Code** | 强大的代码理解和生成能力 | 复杂重构、架构优化 |
| **Gemini CLI** | 快速响应、成本较低 | 简单修复、批量处理 |
| **Codex**（计划中） | OpenAI GPT 系列 | 通用代码生成 |

切换代理只需修改配置：
```bash
export FSC_AGENT_TYPE="gemini-cli"
```

### 5. 并行执行与资源管理

FSC 实现了智能的并行控制：

```typescript
{
  "maxDockerContainers": 10,        // 最多创建 10 个容器
  "maxParallelDockerContainers": 3  // 同时运行 3 个
}
```

这意味着：
- 可以处理最多 10 个任务
- 但同时只运行 3 个，避免资源耗尽
- 任务完成后自动启动队列中的下一个任务

## 使用场景

### 1. 代码库现代化

将老旧的代码库升级到新的技术栈：
- 从 JavaScript 迁移到 TypeScript
- 升级依赖版本
- 采用新的 API 标准

### 2. 代码质量提升

批量改进代码质量：
- 消除代码重复
- 降低圈复杂度
- 统一代码风格
- 添加类型注解

### 3. 安全漏洞修复

自动识别并修复安全问题：
- SQL 注入
- XSS 漏洞
- 不安全的依赖

### 4. 性能优化

系统性地优化性能：
- 识别性能瓶颈
- 优化算法复杂度
- 减少不必要的计算

### 5. 文档生成

为缺少文档的代码库补充文档：
- 函数和类的注释
- README 文件
- API 文档

## 快速开始

### 安装

```bash
# 1. 安装 Bun（推荐）
curl -fsSL https://bun.sh/install | bash

# 2. 克隆项目
git clone https://github.com/NO-CHATBOT-REVOLUTION/full-self-coding.git
cd full-self-coding

# 3. 安装依赖
bun install
```

### 配置

创建全局配置文件 `~/.config/full-self-coding/config.json`：

```json
{
  "agentType": "claude-code",
  "anthropicAPIKey": "sk-ant-api03-...",
  "maxDockerContainers": 10,
  "maxParallelDockerContainers": 3,
  "dockerTimeoutSeconds": 600,
  "workStyle": "default",
  "codingStyleLevel": 5
}
```

或使用环境变量：

```bash
export FSC_ANTHROPIC_API_KEY="sk-ant-api03-..."
export FSC_AGENT_TYPE="claude-code"
export FSC_MAX_PARALLEL_DOCKER_CONTAINERS=3
```

### 运行

```bash
# 在当前目录运行
bun run start

# 或使用 CLI（如果已安装）
full-self-coding-cli
```

### 查看结果

执行完成后，FSC 会生成：
- 详细的执行报告（Markdown 格式）
- 每个任务的 git diff
- 成功/失败统计
- 修改的文件列表

## 项目结构

FSC 采用 monorepo 架构：

```
full-self-coding/
├── packages/
│   ├── core/              # 核心库
│   │   ├── src/
│   │   │   ├── analyzer.ts
│   │   │   ├── taskSolver.ts
│   │   │   ├── dockerInstance.ts
│   │   │   └── ...
│   │   └── test/
│   └── cli/               # 命令行工具
│       └── src/
│           └── index.ts
├── examples/              # 示例项目
├── docs/                  # 文档
└── README.md
```

核心包可以作为库使用：

```typescript
import { analyzeCodebase, TaskSolverManager, createConfig } from '@full-self-coding/core';

const config = createConfig({
  agentType: 'claude-code',
  anthropicAPIKey: 'your-api-key'
});

const tasks = await analyzeCodebase(config, 'https://github.com/user/repo.git');

const taskSolver = new TaskSolverManager(config, 'https://github.com/user/repo.git');
for (const task of tasks) {
  taskSolver.addTask(task);
}
await taskSolver.start();
```

## 技术栈

- **运行时**：Bun（快速的 JavaScript 运行时）
- **语言**：TypeScript（纯 TypeScript，无需构建步骤）
- **容器化**：Docker
- **AI 代理**：Claude Code、Gemini CLI
- **测试**：Bun Test

## 未来展望

FSC 项目还在快速发展中，未来计划包括：

1. **更多 AI 代理支持**：集成 OpenAI Codex、GitHub Copilot 等
2. **增量分析**：只分析变更的部分，提高效率
3. **智能合并**：自动解决代码冲突
4. **可视化界面**：提供 Web UI 监控执行过程
5. **插件系统**：支持自定义分析器和任务类型
6. **云端执行**：支持在云端运行，无需本地 Docker

## 总结

Full Self Coding 代表了 AI 辅助编程的一个新方向：从"人类指挥 AI"到"AI 自主工作"。通过智能分析、任务分解和并行执行，FSC 能够在无需人工干预的情况下，自动发现并解决代码库中的各种问题。

虽然目前 FSC 还处于早期阶段，但它展示了一个令人兴奋的可能性：未来的软件开发可能不再需要程序员逐行编写代码，而是通过配置和监督，让 AI 代理自动完成大部分编码工作。

如果你对这个项目感兴趣，欢迎访问 [GitHub 仓库](https://github.com/NO-CHATBOT-REVOLUTION/full-self-coding)，贡献代码或提出建议。让我们一起探索 AI 自动化编程的未来！

---

**项目链接**：
- GitHub: https://github.com/NO-CHATBOT-REVOLUTION/full-self-coding
- 文档: https://full-self-coding.docs.com（即将推出）
- 讨论区: https://github.com/NO-CHATBOT-REVOLUTION/full-self-coding/discussions
