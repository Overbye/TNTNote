# TNTNote

<p align="center">
  <strong>有些想法，不需要被管理。<br />只需要被记住。</strong>
</p>

<p align="center">
  一款本地优先、离线可用的 Markdown 便签。
  <br />打开就写。写完就走。
</p>

<p align="center">
  <a href="https://tntnote.overbye.workers.dev">立即使用</a>
  ·
  <a href="docs/ARCHITECTURE.md">架构设计</a>
  ·
  <a href="docs/IMPLEMENTATION_PLAN.md">开发计划</a>
</p>

---

## 我们重新做了一张便签

很多笔记软件打开后的第一件事，是请你登录。

然后是创建空间、选择模板、学习一套新的整理方法。等一切准备妥当，刚才想记的那句话，可能已经忘了。

TNTNote 反过来。

它先给你一张空白便签。没有注册，没有新手教程，也没有必须完成的设置。你只管写，剩下的事情交给它。

这听起来理所当然。

我们只是把理所当然的事情，认真做了一遍。

## 现在就能用

访问 **[tntnote.overbye.workers.dev](https://tntnote.overbye.workers.dev)**。

不用安装，不用登录。第一次打开时，TNTNote 会为你准备好一张空白便签。

如果你愿意，也可以把它安装到桌面或手机主屏幕。安装之后，它更像一个应用；断网之后，它仍然是一张能写的便签。

## 少一点打扰，多一点确定

### 打开，就是一张纸

没有欢迎页挡在想法前面。游客可以直接创建、编辑和搜索多张便签。

### 你写下的每个字，都认真保存

内容自动写入浏览器的 IndexedDB。切换便签、刷新页面或关闭应用，不需要寻找“保存”按钮。

### 网络不是使用它的前提

TNTNote 是一款可安装的 PWA。应用外壳会缓存在本机，便签也保存在本机；没有网络时，编辑仍可继续。

### Markdown 在，需要时再出现

标题、列表、引用、任务和加粗等基础 Markdown 都能预览。但在写作时，它不会用一堆复杂控件提醒你自己有多专业。

### 熟悉，不等于停在过去

三栏桌面布局、暖色纸张、清晰的层级和明确的操作反馈，来自我们对经典便签体验的理解。移动端则收起分类与列表，把有限的屏幕留给正在写的内容。

## 这一次，我们先做少一点

TNTNote 目前首先是一款可靠的本地便签，而不是一个急着包办一切的“第二大脑”。

现阶段已经完成：

- 无需登录的本地编辑
- IndexedDB 自动保存
- 多便签、搜索与删除确认
- 基础 Markdown 与 GitHub Flavored Markdown 预览
- PWA 安装、静态资源预缓存与离线启动
- 桌面三栏布局与移动端抽屉界面
- Cloudflare Workers Static Assets 部署
- 自动化测试与生产构建检查

没有完成的功能，我们不会把它写成“即将改变世界”。它们会按照清晰的阶段，一项一项做完。

## 数据应该属于写下它的人

当前版本不会把游客便签上传到服务器。数据保存在当前浏览器中，也因此需要注意：清除网站数据、更换浏览器或更换设备，都可能失去尚未导出的内容。

未来加入管理员云同步时，我们仍会坚持几条边界：

- 游客本地数据与管理员私有数据使用不同的所有权域
- 登录后的迁移必须由用户明确发起，不能偷偷上传
- 同步携带版本条件，发现冲突时停止覆盖并交给用户选择
- 私有 API 响应不进入 PWA 缓存
- GitHub 凭据只保存在 Cloudflare Worker Secret，绝不进入前端、IndexedDB 或日志

这不是什么值得宣传的高级功能。

这是一个便签应用应该有的基本礼貌。

## 在本地运行

需要 Node.js 22.18 或更高版本。

```bash
npm install
npm run dev
```

运行全部检查：

```bash
npm run check
```

生产构建输出到 `dist/`。Cloudflare Workers Static Assets 配置位于 `wrangler.jsonc`，整个应用不依赖常驻服务器进程。

## 它是怎样工作的

```text
React UI
   ↓
useNotes
   ↓
NoteRepository
   ↓
IndexedDB
```

界面不会直接操作 IndexedDB。数据仓库可以在测试和未来同步实现中替换，认证、D1/R2、Markdown 传输、冲突处理以及 GitHub 私有备份也已经预留类型化接口。

更完整的技术说明见 [架构设计](docs/ARCHITECTURE.md)。

## 接下来

### 第二阶段：带得走

Markdown 双向导入与导出、完整归档、恢复预览和可恢复回收站。

### 第三阶段：只为一个人同步

单管理员认证、D1 私有数据、版本校验同步队列，以及明确的三方冲突处理。

### 第四阶段：认真备份

R2 附件、Worker 侧 GitHub 私有仓库备份、恢复预览、审计记录与保留策略。

完整里程碑见 [开发计划](docs/IMPLEMENTATION_PLAN.md)。

## 开源许可

TNTNote 使用 [MIT License](LICENSE) 发布。

---

<p align="center">
  <strong>TNTNote</strong><br />
  先把想法记下来。整理的事，可以晚一点再说。
</p>
