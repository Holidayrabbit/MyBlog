# MyBlog OAuth 中转 Worker 部署指南

背景：GitHub OAuth 的 code 换 token 必须携带 `client_secret`，secret 不能放进前端代码，
因此需要一个极小的服务端中转。本目录的 Worker 部署在 Cloudflare Workers 免费版上，
不需要租服务器（免费额度每天 10 万次请求，个人博客的登录场景用不到 1%）。

Worker 全程只做三件事：跳转 GitHub 授权页、用 secret 换 token、校验登录账号必须是
`Holidayrabbit` 本人后把 token 带回博客。**任何其他账号在 Worker 层就会被拒绝。**

## 部署步骤（网页操作，约 10 分钟，无需装任何工具）

### 第 1 步：创建 Cloudflare Worker

1. 注册/登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)（免费计划即可）
2. 左侧菜单 **Workers & Pages → Create** → 选择 **Create Worker**
3. 名字填 `myblog-oauth` → 点 Deploy（先用默认代码）
4. 部署成功后记下 Worker 地址，形如：
   `https://myblog-oauth.<你的子域>.workers.dev`

### 第 2 步：创建 GitHub OAuth App

1. 打开 <https://github.com/settings/developers> → **New OAuth App**
2. 填写：
   - **Application name**: `MyBlog Admin`（随意）
   - **Homepage URL**: `https://holidayrabbit.github.io/MyBlog/`
   - **Authorization callback URL**: `https://myblog-oauth.<你的子域>.workers.dev/callback`
     （即第 1 步的 Worker 地址 + `/callback`，必须一字不差）
3. 注册后进入应用页，复制 **Client ID**，点 **Generate a client secret** 生成 **Client Secret**
   （secret 只显示一次，先复制保存）

### 第 3 步：配置 Worker

回到 Cloudflare 的 Worker 页面：

1. 点 **Edit code**，把本目录 `worker.js` 的全部内容粘贴进去，点 **Deploy**
2. **Settings → Variables and Secrets**：
   - **Add variable** → Name 填 `GITHUB_CLIENT_ID`，Value 填第 2 步的 Client ID，类型选
     **Text**，Deploy
   - **Add variable** → Name 填 `GITHUB_CLIENT_SECRET`，Value 填第 2 步的 Secret，
     类型务必选 **Secret**（加密存储，之后不可见），Deploy

### 第 4 步：接入博客前端

1. 打开 `src/utils/githubApi.ts`，把顶部的：
   ```ts
   export const OAUTH_WORKER_URL = '';
   ```
   改为你的 Worker 地址（结尾不要带斜杠）：
   ```ts
   export const OAUTH_WORKER_URL = 'https://myblog-oauth.<你的子域>.workers.dev';
   ```
2. 提交并推送到 GitHub，等 Pages 部署完成

### 第 5 步：验证

访问 `https://holidayrabbit.github.io/MyBlog/#/admin` → 应出现"使用 GitHub 登录"按钮 →
点击后跳转 GitHub 授权 → 同意后自动回到后台并进入文章列表。
用其他 GitHub 账号授权会被 Worker 直接拒绝（403 页面提示账号不符）。

## 常见问题

- **提示 redirect_uri mismatch**：OAuth App 的 callback URL 与实际 Worker 地址不一致，
  检查是否漏了 `/callback`、多了斜杠、或用了旧地址
- **点了按钮没反应**：说明前端还没配置 `OAUTH_WORKER_URL`（第 4 步）
- **登录后博客登录页显示"Worker 内部错误：xxx"**：这就是真实的失败原因（已替代 Cloudflare 1101 白屏），
  常见为 GitHub 接口瞬时失败，直接重试即可；若反复出现请把错误信息记录下来
- **查看 Worker 日志**：Dashboard → Worker → Logs → Begin log stream，然后重试登录，
  异常堆栈会实时打印（代码中所有关键失败都有 console.error）
- **本地开发**：回调地址固定是线上 Worker，本地 `npm run dev` 时请继续用 Token 方式登录
- **想撤销授权**：GitHub → Settings → Applications → Authorized OAuth Apps → Revoke；
  Cloudflare Worker 可随时暂停或删除，后台会退回 Token 登录方式

## （可选）用 wrangler CLI 部署

```bash
cd cloudflare-worker
npx wrangler login
# 在 wrangler.toml 中填入 GITHUB_CLIENT_ID 后：
npx wrangler deploy
npx wrangler secret put GITHUB_CLIENT_SECRET   # 粘贴 Client Secret
```
