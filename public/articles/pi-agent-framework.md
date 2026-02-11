---
title: π：极简主义者的Agent框架
date: "2026-02-21"
excerpt: 在大模型Agent框架百花齐放的今天，π选择了一条不同的道路：极简、可扩展、专注核心能力。这篇文章深入解析π框架的设计哲学和核心实现。
tags: ["Agent","TypeScript"]

---

## 引言

在大模型Agent框架领域，重量级选手云集：LangChain功能全面但臃肿，OpenClaw功能强大但复杂。而在GitHub的角落里，有一个名为**π**的项目，由Mario Zechner（libGDX创始人）开发，选择了完全不同的道路：**极简核心，可扩展边界**。

π的核心理念是"轻量级专用Agent"——不试图做所有事情，而是提供一个坚实的核心，让开发者通过扩展构建适合自己工作流的Agent。

## 项目概览

π是一个使用TypeScript编写的Monorepo项目，采用pnpm workspace管理多个包：

| 包名 | 功能 |
|------|------|
| `@mariozechner/pi-ai` | 统一的多Provider LLM API |
| `@mariozechner/pi-agent-core` | Agent运行时（工具调用、状态管理） |
| `@mariozechner/pi-coding-agent` | 交互式编码CLI |
| `@mariozechner/pi-mom` | Slack Bot Agent |
| `@mariozechner/pi-tui` | 终端UI库（差分渲染） |
| `@mariozechner/pi-web-ui` | Web聊天组件 |
| `@mariozechner/pi-pods` | vLLM部署管理CLI |

核心包`pi-agent-core`仅约**1200行代码**，却实现了完整的Agent框架功能。这种精简并非妥协，而是深思熟虑的设计选择。

## Agent设计哲学

### 1. 分层抽象

π采用清晰的分层架构：

```
┌─────────────────────────────────────┐
│   pi-coding-agent / pi-mom          │  应用层
├─────────────────────────────────────┤
│   pi-agent-core (Agent类)           │  运行时层
├─────────────────────────────────────┤
│   agent-loop (循环逻辑)             │  核心层
├─────────────────────────────────────┤
│   pi-ai (统一LLM接口)               │  传输层
└─────────────────────────────────────┘
```

每一层专注自己的职责，不越界。这种分层使得各层可以独立演进。

### 2. 消息类型扩展

π通过TypeScript的声明合并（Declaration Merging）实现消息类型的扩展：

```typescript
// 用户可以自定义消息类型
declare module "@mariozechner/pi-agent-core" {
  interface CustomAgentMessages {
    notification: { role: "notification"; text: string; timestamp: number };
  }
}

// 然后在convertToLlm中处理
const agent = new Agent({
  convertToLlm: (messages) => messages.flatMap(m => {
    if (m.role === "notification") return []; // 过滤掉
    return [m];
  }),
});
```

这种方式比继承更灵活，比配置更类型安全。

### 3. 事件驱动流

π的核心是一个AsyncGenerator，源源不断地产出事件：

```typescript
export type AgentEvent =
  | { type: "agent_start" }
  | { type: "turn_start" }
  | { type: "message_start"; message: AgentMessage }
  | { type: "message_update"; message: AgentMessage; assistantMessageEvent: AssistantMessageEvent }
  | { type: "tool_execution_start"; toolCallId: string; toolName: string; args: any }
  | { type: "tool_execution_end"; toolCallId: string; toolName: string; result: any; isError: boolean }
  | { type: "turn_end"; message: AgentMessage; toolResults: ToolResultMessage[] }
  | { type: "agent_end"; messages: AgentMessage[] };
```

事件流的设计使得UI可以实时响应Agent的每一个动作，也便于调试和监控。

## 核心代码精读

### Agent Loop：心脏跳动

Agent Loop是π的核心，位于`agent-loop.ts`，约400行代码。它的职责是协调LLM调用和工具执行：

```typescript
async function runLoop(
  currentContext: AgentContext,
  newMessages: AgentMessage[],
  config: AgentLoopConfig,
  signal: AbortSignal | undefined,
  stream: EventStream<AgentEvent, AgentMessage[]>,
  streamFn?: StreamFn,
): Promise<void> {
  let firstTurn = true;
  let pendingMessages: AgentMessage[] = (await config.getSteeringMessages?.()) || [];

  // 外层循环：处理follow-up消息
  while (true) {
    let hasMoreToolCalls = true;
    let steeringAfterTools: AgentMessage[] | null = null;

    // 内层循环：处理工具调用和steering消息
    while (hasMoreToolCalls || pendingMessages.length > 0) {
      // 处理待处理消息
      if (pendingMessages.length > 0) {
        for (const message of pendingMessages) {
          stream.push({ type: "message_start", message });
          stream.push({ type: "message_end", message });
          currentContext.messages.push(message);
          newMessages.push(message);
        }
        pendingMessages = [];
      }

      // 调用LLM获取助手响应
      const message = await streamAssistantResponse(currentContext, config, signal, stream, streamFn);
      newMessages.push(message);

      // 检查工具调用
      const toolCalls = message.content.filter((c) => c.type === "toolCall");
      hasMoreToolCalls = toolCalls.length > 0;

      if (hasMoreToolCalls) {
        const toolExecution = await executeToolCalls(/* ... */);
        // 工具执行结果加入上下文
      }

      stream.push({ type: "turn_end", message, toolResults });

      // 检查steering消息
      pendingMessages = (await config.getSteeringMessages?.()) || [];
    }

    // 检查follow-up消息
    const followUpMessages = (await config.getFollowUpMessages?.()) || [];
    if (followUpMessages.length > 0) {
      pendingMessages = followUpMessages;
      continue;
    }

    break; // 没有更多消息，退出
  }

  stream.push({ type: "agent_end", messages: newMessages });
}
```

这个双层循环设计巧妙：
- **外层循环**处理follow-up消息，允许Agent完成任务后继续工作
- **内层循环**处理工具调用链和steering消息（用户中断）

### 消息转换：LLM边界的桥接

π区分`AgentMessage`（应用层消息）和`Message`（LLM消息）：

```typescript
export type AgentMessage = Message | CustomAgentMessages[keyof CustomAgentMessages];
export type Message = UserMessage | AssistantMessage | ToolResultMessage;
```

在每次LLM调用前，通过`convertToLlm`转换：

```typescript
async function streamAssistantResponse(/* ... */) {
  // 应用transformContext（上下文压缩等）
  let messages = context.messages;
  if (config.transformContext) {
    messages = await config.transformContext(messages, signal);
  }

  // 转换为LLM兼容格式
  const llmMessages = await config.convertToLlm(messages);

  // 构建LLM上下文
  const llmContext: Context = {
    systemPrompt: context.systemPrompt,
    messages: llmMessages,
    tools: context.tools,
  };

  // 调用LLM
  const response = await streamFunction(config.model, llmContext, {/*...*/});
  // ...
}
```

这种设计的好处是：
1. **自定义消息类型**不会破坏LLM调用
2. **上下文压缩**可以针对AgentMessage进行
3. **消息过滤**可以轻松实现（如过滤掉UI通知）

### Steering和Follow-up：控制粒度

π提供了两种消息队列机制：

**Steering**：在工具执行过程中插入消息，用于中断Agent

```typescript
agent.setSteeringMode("one-at-a-time");
agent.steer({ role: "user", content: "停下来，做这个", timestamp: Date.now() });
```

**Follow-up**：在Agent完成后继续工作

```typescript
agent.setFollowUpMode("all");
agent.followUp({ role: "user", content: "再总结一下", timestamp: Date.now() });
```

在工具执行循环中，每执行完一个工具就会检查steering消息：

```typescript
for (let index = 0; index < toolCalls.length; index++) {
  // 执行工具...

  // 检查steering消息
  if (getSteeringMessages) {
    const steering = await getSteeringMessages();
    if (steering.length > 0) {
      // 跳过剩余工具
      for (const skipped of toolCalls.slice(index + 1)) {
        results.push(skipToolCall(skipped, stream));
      }
      break;
    }
  }
}
```

这种细粒度控制在实际应用中非常有用，比如用户发现Agent走错方向时可以立即纠正。

### Proxy模式：浏览器友好的流式传输

π还提供了`streamProxy`函数，用于通过代理服务器调用LLM：

```typescript
export function streamProxy(model: Model<any>, context: Context, options: ProxyStreamOptions) {
  // 发送请求到代理服务器
  const response = await fetch(`${options.proxyUrl}/api/stream`, {
    method: "POST",
    headers: { Authorization: `Bearer ${options.authToken}` },
    body: JSON.stringify({ model, context, options }),
  });

  // 接收服务器发送的精简事件
  while (true) {
    const line = await readLine(response.body);
    const proxyEvent = JSON.parse(line);
    // 客户端重建partial消息
    const event = processProxyEvent(proxyEvent, partial);
    stream.push(event);
  }
}
```

代理服务器会剥离`partial`字段减少带宽，客户端重建。这种设计使得Web应用可以安全地使用π，无需暴露API Key。

## 应用场景

### 1. Coding Agent：终端编码助手

`pi-coding-agent`是π的主要应用，一个终端交互式编码助手：

```bash
npm install -g @mariozechner/pi-coding-agent
pi
```

默认提供4个工具：
- `read`：读取文件
- `write`：写入文件
- `edit`：精确编辑
- `bash`：执行命令

扩展方式：
- **Skills**：Markdown定义的可复用工作流
- **Prompt Templates**：提示词模板
- **Extensions**：TypeScript扩展（自定义UI、命令）
- **Themes**：主题定制

### 2. Mom：自管理Slack Bot

`pi-mom`是一个"自管理"的Slack Bot：

```bash
npm install @mariozechner/pi-mom
mom --sandbox=docker:mom-sandbox ./data
```

Mom的特点：
- **自安装工具**：需要什么工具自己安装（apk, npm等）
- **自配置凭证**：要求用户提供token并存储
- **持久化工作空间**：所有数据存在`./data`目录
- **无限历史**：通过grep `log.jsonl`实现无限历史搜索

Mom展示了一个轻量级Agent如何做到完全自治——没有预设的工具，而是根据需要动态安装。

### 3. 其他场景

π的轻量级特性使其适合构建各种专用Agent：
- **文档助手**：结合搜索和RAG
- **运维Agent**：监控和自动化脚本执行
- **测试Agent**：动态生成和运行测试
- **数据分析师**：SQL查询和可视化

## 总结

π框架的成功在于它**不试图做所有事情**：

| 特性 | π | 其他框架 |
|------|---|---------|
| 核心代码量 | ~1200行 | 数万行 |
| 扩展方式 | TypeScript类型系统 | Python类/配置 |
| 消息类型 | 声明合并 | 固定schema |
| 状态管理 | 简单对象 | 复杂图 |
| 学习曲线 | 陡峭但短 | 平缓但长 |

如果你想要一个开箱即用的Agent，LangChain或OpenClaw可能是更好的选择。但如果你想**深度理解Agent的工作原理**，或者构建一个**完全贴合自己工作流**的Agent，π提供了一个完美的起点。

正如它的名字π——简单、纯粹、无限可能。

---

**参考链接**：
- π GitHub: https://github.com/badlogic/pi-mono
- π 官网: https://pi.dev
- 作者博客: https://mariozechner.at
