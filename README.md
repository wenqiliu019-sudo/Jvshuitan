# 聚水潭网页下单 SOP

在 Windows 上连接专用 Chrome，让 Codex 按已验证流程操作聚水潭 ERP。支持手工下单、核对在售 SKU 与包装数量、填写卖家备注，以及按当前账号的约定添加标签并返回内部单号。

完整操作方法见 [使用说明](使用说明.md)。首次使用：

```powershell
npm.cmd install
node scripts/start-browser.cjs
```

在新打开的 Chrome 中手动登录聚水潭，然后让 Codex 读取 [下单技能](.agents/skills/jst-manual-order/SKILL.md)，先检查连接，收到实际下单指令后再创建订单。

本仓库包含流程、SKU 对照和连接脚本。客户信息、登录凭据、浏览器资料及个人标签配置应保存在各自本机，不提交到仓库。首次接入新账号时单独确认标签偏好。
