# TNTNote

TNTNote 是一个从零实现的、经典便签风格的本地优先 Markdown PWA。游客无需登录即可创建和编辑便签；首阶段数据只保存在当前浏览器的 IndexedDB 中。

> 当前为第一阶段 MVP。本项目未 Fork、未复制 `zhaoolee/notes` 的代码或素材。

## 已完成

- React + TypeScript + Vite
- 游客无登录编辑，首次打开自动创建空白便签
- IndexedDB 自动保存；多便签、搜索、编辑、删除
- 基础 Markdown 与 GitHub Flavored Markdown 预览
- 可安装 PWA、静态资源预缓存与离线启动
- 桌面双栏和移动端抽屉式响应布局
- Cloudflare Workers Static Assets 配置
- 认证、云同步、Markdown 传输、备份与冲突结果的类型化接口

## 本地运行

要求 Node.js 22.18 或更高版本。

```bash
npm install
npm run dev
```

完整检查运行 `npm run check`。构建产物位于 `dist/`，Cloudflare 配置见 `wrangler.jsonc`。

## 数据与安全边界

- 当前记录明确标记为 `guest-local`，只从该所有权域读取。
- 未来管理员记录使用独立的 `admin-private` 所有权域，并由认证后的 Worker API 访问 D1/R2。
- 同步接口要求 `expectedVersion`；版本不匹配时返回显式冲突，不能静默覆盖。
- GitHub 私有仓库备份只能由 Worker 执行；Token 必须存入 Cloudflare Secret，禁止进入前端包、IndexedDB 或日志。
- PWA 只缓存应用静态资源，不缓存未来的私有 API 响应。

设计与里程碑见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) 和 [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)。

## 许可

MIT License，详见 [LICENSE](LICENSE)。
