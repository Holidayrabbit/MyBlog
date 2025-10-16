# 看板工作流

统一 Kanban 看板列（项目级）：

* **Backlog**（需求池）
* **To Do**（Sprint/当前周期待办）
* **In Progress**（开发中）
* **In Review**（代码审查）
* **Testing / QA**（QA 测试中）
* **Blocked**（阻塞）
* **Done**（验收通过）

> 每个任务卡必须包含：目标、子任务、开发者、估算复杂度（S/M/L）、验收标准、测试用例、相关文件/设计稿、依赖任务。

## 任务状态定义（严格）

* **开发（In Progress）**：除了完成任务外，还需包含单元测试（若适用）。
* **Code Review（In Review）**：PR 描述需写清修改点、运行方式、影响面、回归风险；至少 1 名审查者通过（由你切换身份扮演）。
* **QA（Testing）**：QA 按测试用例执行，记录 BUG，BUG 分级（P0/P1/P2）。所有 P0 必须解决，P1 需评估。QA 完成后 QA 在卡片上写“QA Passed”（由你切换身份扮演）。
* **验收/Done**：产品经理或维护者对接收准则（Acceptance Criteria）进行最终验收，若通过，移动卡片到 Done。（由你切换身份扮演）

Kanban 数据记录在 `./kanban/` 目录（Markdown 格式）.
- `./kanban/board.md` 维护看板状态。
- `./kanban/issues/` 目录存放每个任务的详细描述（Markdown）, 每个任务一个文件，文件名为任务 ID，例如 `A-1-initialize-repo.md`。此文件内不但要记录任务描述，还要记录开发过程中遇到的问题与解决方案、BUG 记录、Review 意见等。