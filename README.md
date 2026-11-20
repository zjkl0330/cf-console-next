# CF-next（cf-console-next）

Cloudflare 边缘控制台「Next」界面 —— 单文件移动端 UI（零依赖 vanilla JS），外加 Capacitor Android 封装。

- `www/index.html`：完整应用（自包含，可直接浏览器打开体验）
- `capacitor.config.json`：Android 封装配置（应用名 **CF-next**，appId `dev.zjkl.cfconsole`，图标为 Cloudflare 官方云朵 mark）
- `assets/icon.png`：1024×1024 源图标（CI 里由 capacitor-assets 生成各密度 mipmap）
- 演示登录门：口令 `cf-demo`（登录页有一键填入提示）
- `.github/workflows/build-apk.yml`：push / 手动触发即构建**生产签名 APK**，自动发布 GitHub Release 并挂产物

## 本地出包

```bash
npm ci
npx cap add android
npx cap sync android
cd android && ./gradlew assembleDebug
# 生产签名需先注入 keystore（见 workflow 中 secrets 用法），本地调试可用 assembleDebug
```

## 功能覆盖

总览（世界地图 choropleth / 图表切换 / 健康判定 / 深度分析）、域名与 DNS（多站点、记录向导、路由 CRUD）、计算（Worker 配置全家桶、灰度、Pages 仓库/域名/环境变量/构建日志）、数据（KV 编辑覆盖 / D1 SQL / R2）、安全（Zero Trust Free 档可写：应用 / 用户组 / 策略 / 席位）、API 令牌（创建向导 / 一次性值 / 轮换 / 吊销）、设置（主题 / 网关 / 预算账本 / OAuth / Git 令牌 / 保险箱加密导出）。

所有写操作走「回显确认契约」：先展示方法 / 路径 / 请求体，确认才执行；删除需手打名称，均可撤销。
