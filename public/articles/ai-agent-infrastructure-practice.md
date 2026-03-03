---
title: "AI Agent Infrastructure 实战: Browser Use 如何从 AWS Lambda 演进到 Unikraft"
date: "2026-03-03"
tags: ["Agent", "Infrastructure", "Security", "Architecture"]
excerpt: "当 AI Agent 需要执行代码时,如何确保安全、高效地运行?本文通过 Browser Use 的真实案例,深入讲解从 AWS Lambda 到 Unikraft micro-VMs 的架构演进,揭示沙箱隔离、控制平面设计和安全最佳实践。"
---

# AI Agent Infrastructure 实战: Browser Use 如何从 AWS Lambda 演进到 Unikraft

在 AI Agent 日益普及的今天,一个核心问题摆在所有开发者面前:**当 Agent 可以执行代码时,如何确保它安全、高效地运行?**

最近,Browser Use 的技术博客分享了一个精彩的架构演进案例:从 AWS Lambda 到 Unikraft micro-VMs 的迁移历程。这不仅是一个技术选型的故事,更揭示了 AI Agent Infrastructure 的核心设计哲学。

## 🔄 架构演进路径

### 初期: AWS Lambda 时代

Browser Use 最初选择 AWS Lambda 作为运行环境,主要考虑:
- **隔离性好**: Lambda 自带隔离机制,每个调用独立
- **扩展性强**: 自动扩展,按需计费
- **简单**: 无需管理基础设施

这个阶段只能运行浏览器自动化,一切都很美好。

### 中期: 添加代码执行能力

随着业务发展,需要让 Agent 能够:
- 执行 Python 代码
- 运行 Shell 命令
- 创建和修改文件

**问题出现**: Agent loop 和 REST API 共享同一进程,导致:
- ❌ 重新部署时,所有运行中的 Agent 死亡
- ❌ 内存密集型 Agent 影响 API 性能
- ❌ 两种根本不同的工作负载混杂在一起

### 最终: Unikraft Micro-VM + 控制平面

核心决策:**从"隔离工具"转向"隔离 Agent"**

```TEXT
旧架构 (模式 1):
Backend (持有密钥) → Sandbox (代码执行)

新架构 (模式 2):
Backend → Control Plane (持有密钥) → Sandbox (无密钥 Agent)
```

**结果**:
- ✅ Agent 变成"可抛弃的"(Disposable)
- ✅ 无密钥可盗,无状态需保存
- ✅ 可随时杀死、重启、独立扩展

## 🛡️ 两种隔离模式深度对比

### 模式 1: 隔离工具

```TEXT
┌──────────────┐
│   Backend    │
│  (持有密钥)   │
└──────┬───────┘
       │ HTTP 调用
       ▼
┌──────────────┐
│   Sandbox    │
│ (代码执行)    │
└──────────────┘
```

**特点**:
- Agent 运行在你的基础设施上
- 仅危险操作(代码执行)在沙箱中
- Backend 持有密钥

**问题**:
- Backend 仍需保护密钥
- Agent 可访问部分内部资源
- 重新部署仍会影响 Agent

### 模式 2: 隔离 Agent (推荐)

```TEXT
┌──────────────────┐
│  Control Plane   │
│  (持有所有密钥)   │
└────────┬─────────┘
         │ 代理请求
         ▼
┌──────────────────┐
│ Sandbox (Agent)  │
│  (无密钥)         │
└──────────────────┘
```

**特点**:
- **整个 Agent 运行在沙箱中**
- 沙箱零密钥(只有 SESSION_TOKEN)
- 控制平面持有凭证,作为代理

**优势**:
- ✅ Agent 完全可抛弃
- ✅ 无密钥可盗、无状态需保存
- ✅ 可随时杀死、重启、独立扩展

## 🏗️ 控制平面架构详解

Browser Use 的实际架构:

```TEXT
┌─────────────────────────────────────────────┐
│          用户请求                            │
└────────────────┬────────────────────────────┘
                 ▼
┌─────────────────────────────────────────────┐
│   Backend (ECS Fargate + ALB)               │
└────────────────┬────────────────────────────┘
                 ▼
┌─────────────────────────────────────────────┐
│   Control Plane (FastAPI)                   │
│   - 验证 SESSION_TOKEN                      │
│   - 持有 LLM API 密钥                        │
│   - 保存会话历史                             │
│   - 生成 S3 presigned URLs                  │
└────────────────┬────────────────────────────┘
                 │
        ┌────────┴─────────┐
        ▼                  ▼
┌──────────────┐    ┌──────────────┐
│  Sandbox 1   │    │  Sandbox 2   │
│ (Unikraft)   │    │ (Unikraft)   │
│ - Agent 代码  │    │ - Agent 代码  │
│ - 浏览器      │    │ - 浏览器      │
│ - Python     │    │ - Python     │
└──────────────┘    └──────────────┘
```

### 控制平面的核心功能

| 功能 | 说明 |
|------|------|
| **凭证管理** | 持有 API 密钥、数据库密码等 |
| **请求代理** | LLM 调用、文件上传、外部 API 访问 |
| **会话管理** | 保存完整对话历史 |
| **成本控制** | 实施成本上限和计费 |
| **可观测性** | 监控 Agent 行为、追踪执行流程 |

**关键设计**:
- 沙箱只接收 3 个环境变量: `SESSION_TOKEN`、`CONTROL_PLANE_URL`、`SESSION_ID`
- 沙箱在私有 VPC 中,只能访问控制平面
- 控制平面无状态,可独立扩展

## 🔐 安全最佳实践

Browser Use 实施了多层防御体系:

### 1. 字节码执行

```dockerfile
# Dockerfile
RUN python -m compileall .  # 编译为 .pyc
RUN find . -name "*.py" -delete  # 删除源码
```

**优势**:
- Agent 无法读取源代码
- 防止代码篡改

### 2. 权限降级

```bash
# 启动脚本
1. 以 root 读取字节码
2. 立即 setuid/setgid 到 sandbox 用户
3. 后续所有操作均无特权
```

### 3. 环境剥离

```python
# 读取环境变量后立即删除
SESSION_TOKEN = os.environ.pop('SESSION_TOKEN')
CONTROL_PLANE_URL = os.environ.pop('CONTROL_PLANE_URL')
SESSION_ID = os.environ.pop('SESSION_ID')

# 后续 Agent 无法访问这些变量
```

### 4. 网络隔离

- 沙箱运行在**私有 VPC** 中
- 只允许访问控制平面
- 无公网访问权限

### 5. Presigned URLs (文件上传)

**问题**: 沙箱需要上传文件到 S3,但不能持有 AWS 密钥

**解决方案**:
```
1. 沙箱检测 /workspace 文件变更
2. 调用控制平面: POST /presigned-urls
3. 控制平面生成临时的 S3 上传 URL (有效期5分钟)
4. 沙箱直接上传到 S3 (无需凭证)
```

## 🚀 扩展性与部署策略

### 三层独立扩展

```
┌─────────────────────────────────────────────┐
│   Layer 1: Backend API                      │
│   - ECS Fargate                             │
│   - Auto-scaling by CPU                     │
└─────────────────────────────────────────────┘
                 ▼
┌─────────────────────────────────────────────┐
│   Layer 2: Control Plane                    │
│   - FastAPI (stateless)                     │
│   - Load Balancer + 多实例                   │
└─────────────────────────────────────────────┘
                 ▼
┌─────────────────────────────────────────────┐
│   Layer 3: Sandboxes                        │
│   - Unikraft Micro-VMs                      │
│   - Scale-to-zero (自动休眠)                │
│   - 分布在多个 metros (数据中心)            │
└─────────────────────────────────────────────┘
```

**关键策略**:
- 每层根据**自己的瓶颈**独立扩展
- 沙箱按需创建,空闲时自动休眠
- 控制平面无状态,可水平扩展

### 部署一致性

**"一套镜像,多处运行"**:

```yaml
# 同一个 Docker 镜像
sandbox_mode: 'docker' | 'ukc'  # 配置开关

# 本地开发
sandbox_mode: 'docker'

# 生产环境
sandbox_mode: 'ukc'  # Unikraft Cloud
```

**优势**:
- ✅ 本地开发 = Docker 容器
- ✅ 评估测试 = Docker 容器 (可并行运行数百个)
- ✅ 生产环境 = Unikraft Micro-VM
- ✅ 相同的入口点、相同的控制平面协议

## 📊 技术选型对比

### AWS Lambda vs MicroVM

| 特性 | AWS Lambda | MicroVM (AgentCore) |
|------|-----------|---------------------|
| **会话持久性** | 无状态,冷启动 | **会话感知**,保持活跃 |
| **隔离强度** | 强 (底层 Firecracker) | 强 (硬件级) |
| **启动延迟** | 冷启动惩罚 | **~125ms** (或更快) |
| **执行时间** | 最长 15 分钟 | **可长时间运行** |
| **成本模型** | 按请求计费 | 按 vCPU 小时 (~$0.04/hr) |

**推荐**:
- **对话型 Agent** → MicroVM (会话持久性重要)
- **简单事件驱动任务** → AWS Lambda 足够

### 主流隔离技术对比

| 技术 | 隔离强度 | 启动速度 | 典型应用 |
|------|---------|---------|---------|
| **传统 VM** | ⭐⭐⭐⭐⭐ | 慢 (分钟级) | 传统云服务 |
| **容器 (Docker)** | ⭐⭐ | 快 (秒级) | 微服务、K8s |
| **MicroVM** | ⭐⭐⭐⭐ | 极快 (<1秒) | Firecracker、gVisor |
| **WASM** | ⭐⭐⭐ | 极快 (毫秒级) | 边缘计算 |

**2024-2025 趋势**: AI Agent 沙箱正从**容器向 MicroVM 全面迁移**。

**实际案例**:
- OpenAI Code Interpreter → 基于 **gVisor**
- E2B Sandbox → 月创建量从 4万飙升至 **1500万** (增长 375倍)
- Anthropic Cowork → 采用 **Apple Virtualization**

## 📚 实际案例对比

| 案例 | 技术栈 | 特点 | 适用场景 |
|------|-------|------|---------|
| **Browser Use** | Unikraft + 控制平面 | Web agents + 代码执行 | 生产环境 |
| **OpenAI Code Interpreter** | gVisor | 文件上传 + Python 执行 | 数据分析 |
| **E2B Sandbox** | 独立 microVM | 多语言支持 | 通用代码执行 |

### 案例 1: Browser Use

**背景**:
- 运行数百万个 web agents
- 起初: AWS Lambda + 浏览器自动化
- 后来: 添加代码执行能力 (Python、Shell)

**演进历程**:
1. **架构升级**: 从模式1 (隔离工具) → 模式2 (隔离 Agent)
2. **技术栈**: Unikraft Micro-VM (生产) + Docker (开发)
3. **控制平面**: 无状态 FastAPI,持有所有凭证
4. **安全措施**: 字节码执行 + 权限降级 + 环境剥离

**结果**:
- Agent 变成"可抛弃的"
- 可独立扩展三层
- 零密钥可盗

- 成本降低 70%

### 案例 2: OpenAI Code Interpreter

**技术栈**: 基于 **gVisor** 构建

**特点**:
- 用户上传文件
- Agent 执行 Python 代码
- 生成图表、数据分析

**安全**:
- gVisor 提供系统调用级别的隔离
- 防止恶意代码访问主机

### 案例 3: E2B Sandbox

**增长数据**:
- 2024年初: 月创建量 4万
- 2025年: 月创建量 **1500万** (增长 375倍)

**特点**:
- 独立 CPU/内存/存储
- 完全隔离的执行环境
- 支持多种编程语言

## 🎯 核心要点总结

### 关键概念

1. **AI Agent** = 自主感知、规划、记忆、行动的智能体
2. **Agent Infrastructure** = 沙箱隔离 + 多智能体协作 + 安全扩展 + 可观测性
3. **沙箱隔离** = 严格控制的隔离环境,防止 Agent 访问敏感资源

### 技术选型指南

| 场景 | 推荐技术 |
|------|---------|
| **生产环境 Agent** | Unikraft Micro-VM / Firecracker |
| **开发/测试** | Docker 容器 |
| **简单事件驱动** | AWS Lambda |
| **企业级多 Agent** | 控制平面架构 |

### 安全原则

> **"你的 Agent 应该没有任何值得窃取的东西,也没有任何值得保留的东西。"**
>
> — Browser Use 团队

**核心措施**:
- ✅ 字节码执行 (隐藏源码)
- ✅ 权限降级 (最小特权)
- ✅ 环境剥离 (动态删除密钥)
- ✅ 网络隔离 (私有 VPC)
- ✅ Presigned URLs (临时访问)

### 架构模式

**推荐**: **隔离 Agent 模式** (模式 2)

```
用户 → Backend → Control Plane (持有密钥) → Sandbox (无密钥 Agent)
```

**优势**:
- Agent 完全可抛弃
- 控制平面无状态,可扩展
- 三层独立扩展

## 📖 延伸阅读

### 基础概念
- [深入理解 Agent Infra: AI智能体技术基石](https://m.blog.csdn.net/2401_84204207/article/details/156463190)
- [AI Agent 百度百科](https://baike.baidu.com/item/AI%20Agent/63546393)

### 沙箱技术
- [AI Agent 沙箱技术选型与原理](https://www.langchain.cn/t/topic/845)
- [阿里云 AIO Sandbox](https://help.aliyun.com/zh/functioncompute/fc/aio-sandbox)

### Unikraft & MicroVM
- [Unikraft 官网](https://unikraft.org/)
- [AWS Firecracker GitHub](https://github.com/firecracker-microvm/firecracker)

### 控制平面架构
- [Control Plane as a Tool (arXiv)](https://arxiv.org/html/2505.06817v1)
- [Google Cloud: Agentic AI Design Patterns](https://cloud.google.com/architecture/choose-design-pattern-agentic-ai-system)

### 安全最佳实践
- [Google AI Agent 安全框架](https://www.cnblogs.com/wintersun/p/19217948)
- [微软 AI Agent 可观测性实践](https://reactor.microsoft.com/zh-cn/reactor/series/s-1590/)

### 实际案例
- [20个企业级案例揭示 Agent 落地真相](https://www.opp2.com/377390.html)
- [制造业 Agent 实战案例全景解析](https://cloud.tencent.com/developer/article/2590542)

---

希望这篇文章能帮助读者系统性地理解 AI Agent Infrastructure 的核心设计理念和实践方法! 🚀
