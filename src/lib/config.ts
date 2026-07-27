/**
 * 静态站点的路径前缀。
 * 部署到 https://<user>.github.io/<repo>/ 时需要设成 /<repo>，
 * 由 GitHub Actions 按仓库名自动注入；本地和自定义域名下为空串。
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** 预生成数据的根路径 */
export const EXAM_DATA = `${BASE_PATH}/exam`;
