# 木栖家居科技（上海）有限公司 — 公司官网

Muqi Home Technology (Shanghai) Co., Ltd. 官方网站。极简风格单页展示站点 + 团队架构页 + 内容管理系统（CMS）。

## 技术栈

- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS 3**（构建时编译，无运行时 CDN）
- **Framer Motion**（动效）、**lucide-react**（图标）
- **React Router 6**（HashRouter，兼容静态托管）
- **Firebase**（Auth + Firestore，用于 CMS 登录与内容同步）

## 本地开发

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build && npm run preview
```

## 项目结构

```
├── index.html          # 入口 HTML（含 SEO meta / OG / JSON-LD）
├── index.tsx           # React 入口
├── App.tsx             # 路由与单页区块编排
├── components/         # Header / Hero / About / 轮播 / 部门 / 项目 / 新闻 / Footer / AdminPanel
├── pages/              # ProductDetail / LoginPage / TeamPage
├── context/            # ContentContext（内容状态 + Firebase 同步）
├── constants.ts        # 站点默认内容（改这里换文案/图片/联系方式）
├── types.ts            # 内容类型定义
├── firebase.ts         # Firebase 配置（需填入真实项目凭据）
└── tailwind.config.js  # Tailwind 主题（stone/wood 色板、字体）
```

## 上线前必做

1. **Firebase 配置**：在 `firebase.ts` 填入真实项目凭据（apiKey 等），并在控制台创建
   `site_content/main` 文档、开启 Auth + Firestore（配安全规则）。
2. **品牌资产**：将真实 Logo 放入 `public/logo.png` 并在 `constants.ts` 的
   `company.logo` 填写路径；替换 hero/about/产品/项目/新闻的 picsum/unsplash
   占位图；员工照片请使用真实成员照片。
3. **备案信息**：将 `company.icp` 的 `沪ICP备××××××号` 替换为真实备案号。
4. **联系方式**：核对 `company.email / phone / phoneMobile` 与 `address`。
5. **社交链接**：填写 `company.socials` 的真实账号地址（未填写的项不会渲染为链接）。

## 安全说明

- 演示账号 `admin@muqi.com / 123456` **仅在本地开发环境（`npm run dev`）可用**，
  生产构建会将其移除（`import.meta.env.DEV` 门控），不构成认证后门。
- CMS 图片以压缩后的 Base64 存入 Firestore（上传时自动压缩至 800px）。
  内容量大后建议迁移至 Firebase Storage，文档内仅存 URL。

## 许可

私有项目，代码归木栖家居科技（上海）有限公司所有。
