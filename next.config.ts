import path from "path";
import type { NextConfig } from "next";

// 纯静态导出：产物在 out\，可直接托管到 GitHub Pages 或用 scripts\serve.mjs 本地跑。
// 部署到 https://<user>.github.io/<repo>/ 时要带路径前缀，由 CI 注入 NEXT_PUBLIC_BASE_PATH。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// 构建时间戳，工牌上的 Last Update 用它。构建期求值后内联进产物，
// 所以每次部署自动更新，不必手改。CI 跑在 UTC，日期以 UTC 为准。
const now = new Date();
const buildDate = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  env: { NEXT_PUBLIC_BUILD_DATE: buildDate },
  // 静态托管没有图片优化服务；本项目的题图都是 <img>，这里只是关掉默认优化器
  images: { unoptimized: true },
  // 目录式路径（/xxx/index.html），GitHub Pages 直接命中，避免 404
  trailingSlash: true,
  // 显式锁定 workspace root，避免存在多个 lockfile 时 Turbopack 误判
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
