---
title: "上下文工程：把大模型的大话，变成落地的系统"
date: "2026-02-23"
tags: ["Agent", "Context Engineering", "Architecture"]
excerpt: "当 AI 领袖在谈论人类发展时，一线开发者正在解决现实问题：上下文退化、记忆衰退与资源限制。这是一篇关于上下文工程（Context Engineering）及其在 Agent 系统中应用的实战指南。"
---

# 上下文工程：把大模型的大话，变成落地的系统

2026 年初，Sam Altman 将模型训练等同于人类的发展，引发了强烈的反弹。知名开发者、[Agent-Skills-for-Context-Engineering](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering) 仓库的作者 Muratcan Koylan 在推特上无情反击：

> *"I build AI for a living. I believe in what we're building. But this kind of rhetoric makes my work harder and more dangerous. @sama, comparing human development to model training is tone-deaf, strategically reckless. People are losing jobs. They're getting angry."*
> 
> *“我靠构建 AI 为生。我相信我们正在构建的东西。但这种言辞让我的工作变得更困难和危险。把人类发展和模型训练相提并论，缺乏共情，在战略上极度鲁莽。”*

这一幕揭示了当今 AI 行业的典型撕裂：顶层的布道者们热衷于宏大叙事，而像 Muratcan 和 Manus 创始人 Peak 这样的一线开发者，却在泥泞中与系统的极限日夜搏斗。在真正的生产环境里，决定产品成败的不再是模型有多像“生命”，而是最硬核的工程问题。

由此，**上下文工程（Context Engineering）** 应运而生，并迅速确立为**应用层与模型层之间最清晰、最实用的边界。**

## 什么是上下文工程？它为什么比 Prompt 提示词更重要？

如果说**提示词工程（Prompt Engineering）**关注的是“如何把话跟 AI 说清楚”（Crafting effective instructions），那么**上下文工程（Context Engineering）**就是关注“如何管理 AI 的大脑带宽”（Managing the limited attention budget）。

在当前的主流架构中，AI Agent 在循环调用工具时，如果不管不顾地将所有工具调用的记录和返回结果（如长篇的网页搜索、巨型文件内容）全部塞进下一次的会话里，很快就会遭遇**“上下文衰减（Context Rot）”**：模型会出现“迷失在中间（Lost-in-the-middle）”的现象，开始重复旧动作、执行变慢、输出质量严重下降甚至幻觉。

有效进行上下文工程的核心原则是：**用最小量的高质量 Token，最大化输出达到预期效果的可能性。**

基于 Manus 系统的实践以及开源社区探索，上下文工程可分为以下 5 个核心维度。

### 1. 上下文卸载 (Context Offloading)

并非所有信息都需要保留在 Agent 的直接记忆窗口中。卸载的核心思想是**将上下文转移到外部存储中**。
你可以将动辄占用上万 token 的搜索结果、大体积代码全部“转储”为文件系统里的文本或日志，只给模型返回一条极其简短的消息，例如：`{ "status": "success", "file_path": "/tmp/search_result.txt" }`。只有当模型真正需要某些细节时，再通过文件路径进行精准提取。

### 2. 上下文精简 (Context Compaction & Summarization)

精简不是直接删除，分为两种思路：
- **可逆压缩 (Reversible Compaction)**：比如工具调用的紧凑格式。执行“写入文件”后，模型已知文件建立成功，你可以把超长的 `content` 丢掉，只保留动作的骨架（如 `path`：`xx.py`）。这个做法是**可逆**的，如果有需要，依然可以通过卸载的路径把内容拉回来。
- **摘要 (Summarization)**：当压缩不足以应对无节制增长时，我们需采用结构化的摘要方案，总结历史进度。这是一项不可逆操作，我们一定要确保“最后的几次操作完整保留”，才能让模型平滑过渡。

### 3. 上下文检索 (Context Retrieval)

信息卸载出去后一定要有能力随时调回。对于基于沙盒的代码 Agent（如 Claude Code），使用轻量级的文件工具诸如 `grep`、`glob`、`cat` 等往往比花大精力建基于向量搜索的 RAG 更高效直接；而对于长期记忆型的系统，则需要外挂向量数据库来按需检索。

### 4. 上下文隔离 (Context Isolation)

这里是解决多 Agent 之间通信风暴的关键。
- **通过通信隔离 (By Communication)**：就像经典的子 Agent 或者功能函数调用。主系统给子系统分发一个非常明确、微型的任务（比如：“搜索某段代码”），子系统的上下文只有那一条指令，完全不携带主环境历史垃圾，算完只需归还结果。
- **通过共享上下文隔离 (By Shared Memory)**：少数需要重度上下文关联的任务，采用继承主历史或特定状态，但拥有不同的动作空间和 System Prompt，成本较高但处理深度研究时必不可少。

### 5. 上下文缓存 (Context Caching)

高效利用 Anthropic 或其他云厂商的 KV Cache（输入端缓存）。将固定或变动较少的知识、工具定义锁在架构最顶端，动态变动的状态放在后面，能极大程度地解决大上下文中昂贵且低效的首字延迟（TTFT）与费用问题。

---

## Agent Skills 解决方案：体系化应对

理解了挑战，如何在工程中落地呢？
Muratcan Koylan 开源的 `Agent-Skills-for-Context-Engineering` 仓库，给出了当下一套绝佳的实战脚手架。它以“技能（Skills）”的形式将庞杂的设计模式打包装配在 AI 开发环境（比如 Claude Code）中。当你使用该套件时，模型会根据任务动态选取恰当的环境设定。

该项目将系统化能力分为五大模块：

1. **Foundational Skills（基础理解）**
   涵盖 `context-fundamentals` 和纠偏的 `context-degradation`，专门应对 Lost-in-middle（中间迷失）或 Context-poisoning（上下文污染），指导模型何时主动清理无用信息。
   
2. **Architectural Skills（架构设计技能）**
   包含多 Agent 设计模式（`multi-agent-patterns`）、长短时记忆挂载（`memory-systems`）、工具设计与防失控策略。特别是引人注目的托管代理思想（`hosted-agents`），能帮你通过沙箱和 Multiplayer 环境构筑最安全的代码 Agent 底座。
   
3. **Operational Skills（运营与优化技能）**
   如何在运行时降本增效？`context-optimization` 会为你应用上文提到的“打包压缩”与“缓存”策略。同时，提供了 `advanced-evaluation` 建立严谨的“LLM-as-a-Judge”。这意味着你在本地开发时，可以用自动生成的基于打分大纲或配对验证法来对系统的改动做客观评估，避免盲目自信。
   
4. **Development Methodology（项目落地方法论）**
   构建 AI Pipeline 需要从测试数据与结构化输出思维起步。`project-development` 提供了一整套模型与任务的适配选择标准指导。
   
5. **Cognitive Architecture Skills（认知架构延伸）**
   进阶的 BDI 模型 (`bdi-mental-states`)，协助你将外部无序数据转化为信念（Beliefs）、愿望（Desires）、意图（Intentions），让 Agent 的反思与行为具有强逻辑的一致性。

### 从平庸结构到“Layered Action Space”

使用该类技能，改变的不止是文件读写的技巧，而是 Agent 的思考模型。举个例子，如果给系统暴露太多琐碎的工具链会导致模型产生“Context Confusion（上下文困惑）”。通过工具设计的指导，一套先进落地的系统应采用**分层动作空间 (Layered Action Space)** ：

1. **核心函数层（Function Calling Layer）**：仅开放 10~20 个具备强原子特性的刚需操作（如最底层的文件读写、网页搜索）。
2. **沙盒调用层（Sandbox Utilities Layer）**：将重型格式转换或执行工具装入系统中，通过 Bash、`grep` 等传统 Shell 命令触发，无需进入模型 Context。
3. **宏与 API 层（Packages & API Layer）**：复杂的业务由 Python 脚本执行并将处理好的微小结果反馈给模型，利用**代码天然的可组合性**。

这个分层极大地保护了模型的 KV Cache 及注意力池，体现了工程上的极简主义。

## 结语：少即是多

正如 Manus 的 Peak 所分享的洞察：
> *"Context engineering is an art and science to achieve the perfect balance between multiple, potentially conflicting goals... Every time we simplify the architecture, the system gets faster, more stable, and more intelligent."*
> *(上下文工程是一门艺术和科学，需要在相互冲突的目标中寻找完美平衡……每次我们简化架构，系统都会变得更快、更稳定、更聪明。)*

无论是应对巨变中的行业生态，还是构建稳定可靠的企业级 Agent，“退一步脚踏实地”往往比好高骛远更为重要。当模型提供商正在疯狂扩大 Context Window 的标称数据并在社交媒体上绘制终局图景时，“上下文工程”的拥趸正在做的，恰恰是：**做减法、去脚手架，在限制中寻找卓越。**

对于正在入局的开发者来说，停止追求将所有一切填给大模型的不切实际，用结构化的约束换取确定性，这就是构建下一代 Agent 的入场券。

---
> *参考资料与拓展阅读*
> - *[Agent Skills for Context Engineering (muratcankoylan/Agent-Skills-for-Context-Engineering)](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering)*
> - *Context Engineering 研讨 - Lance & Peak (LangChain & Manus)*
> - *"Meta Context Engineering via Agentic Skill Evolution" (Peking University, 2026)*
