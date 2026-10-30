# Reillo Personal Website

雷洛 Reillo 的个人网站，使用原生 HTML、CSS 和 JavaScript 构建。

A personal website for Reillo, built with plain HTML, CSS, and JavaScript.

## 功能

- 个人介绍
- 照片页面
- 关于页面
- 学习软件合集（免费软件与官方教育授权入口）
- 实用工具箱（图片转换、文本统计、相机快门查询，以及汇总公网 IPv4/IPv6、NAT、IP 归属地、IPv4 子网、DNS、RDAP 和网络延迟功能的网络工具合集）
- 相机文件与常见 RAW 元数据仅在浏览器本地通过 ExifTool WebAssembly 解析；首次使用需从 CDN 加载解析引擎，快门数与 RAW 支持依机型和文件而异
- IPv4 子网计算在本地完成；网络检测按需连接 ipify、ipwho.is、Cloudflare DNS、rdap.org 及 Google/Cloudflare STUN。相关服务可看到出口 IP 或所查询的地址/域名；NAT 结果仅为浏览器可观测映射特征，不等同完整 NAT 分类
- 技术栈展示
- 近期行程表
- 每周课表
- 按星期和时间自动高亮当前课程
- 节假日与连续休息日课表处理
- 网站更新日志
- 桌面端和移动端响应式布局
- Liquid Glass 风格导航栏

## Features

- Personal profile and introduction
- Photos page
- About page
- Learning software catalog (free software and official education resources)
- Utility toolbox (image conversion, text statistics, camera shutter-count lookup, and a network toolkit collecting public IPv4/IPv6, NAT, IP geolocation, IPv4 subnet, DNS, RDAP, and network latency tools)
- Camera files and common RAW metadata are parsed locally with ExifTool WebAssembly; the parser is loaded from a CDN on first use, and shutter-count/RAW support varies by model and file
- IPv4 subnet calculations run locally; network checks connect on demand to ipify, ipwho.is, Cloudflare DNS, rdap.org, and Google/Cloudflare STUN. Those services can see the public egress IP or queried address/domain; NAT results report browser-observable mapping behavior rather than a full NAT classification
- Technology stack showcase
- Recent itinerary table
- Weekly timetable
- Automatic current-course highlighting based on weekday and time
- Holiday and consecutive-rest-day timetable handling
- Changelog page with update history
- Responsive layout for desktop and mobile devices
- Liquid Glass inspired navigation bar

## 项目结构

- `index.html` - 首页
- `css/index.css` - 首页样式
- `404.html` - 404 错误页面
- `css/404.css` - 404 页面样式
- `photos.html` - 照片页面
- `about.html` - 关于页面
- `css/about.css` - 关于页面样式
- `software.html` - 学习软件合集
- `css/software.css` - 学习软件合集样式
- `js/software.js` - 学习软件搜索与分类筛选
- `tools.html` - 实用工具箱
- `css/tools.css` - 实用工具箱样式
- `js/tools.js` - 图片、文本、相机元数据（ExifTool WebAssembly）、IP 查询、子网计算、DNS、RDAP 与网络延迟工具
- `css/photos.css` - 照片页面样式
- `changelog.html` - 更新日志
- `css/changelog.css` - 更新日志样式
- `js/course-current.js` - 当前课程和节假日课表逻辑
- `js/fadeUpAnimation.js` - 页面入场动画
- `js/collapsible-container.js` - 可折叠内容交互
- `js/loader-container.js` - 加载动画逻辑
- `assets/` - 图片、图标和背景资源

## Project Structure

- `index.html` - Main homepage
- `css/index.css` - Homepage styles
- `404.html` - 404 error page
- `css/404.css` - 404 page styles
- `photos.html` - Photos page
- `about.html` - About page
- `css/about.css` - About page styles
- `software.html` - Learning software catalog
- `css/software.css` - Learning software catalog styles
- `js/software.js` - Catalog search and category filters
- `tools.html` - Utility toolbox
- `css/tools.css` - Utility toolbox styles
- `js/tools.js` - Image/text tools, camera metadata lookup (ExifTool WebAssembly), IP lookup, subnet calculator, DNS, RDAP, and network latency tools
- `css/photos.css` - Photos page styles
- `changelog.html` - Website changelog
- `css/changelog.css` - Changelog styles
- `js/course-current.js` - Current-course and holiday timetable logic
- `js/fadeUpAnimation.js` - Page entrance animations
- `js/collapsible-container.js` - Expandable content interactions
- `js/loader-container.js` - Loading screen behavior
- `assets/` - Images, favicons, and background assets

## 本地运行

无需构建工具。可以直接在浏览器中打开 `index.html`，也可以使用本地服务器：

No build tools are required. Open `index.html` directly in a browser, or serve the directory with a local web server:

```powershell
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

## Run Locally

No build tools are required. Open `index.html` directly in a browser, or serve the directory with a local web server:

Then visit:

```powershell
python -m http.server 8000
```

```text
http://localhost:8000
```

## 部署到 GitHub Pages

1. 打开 GitHub 仓库设置。
2. 进入 **Pages**。
3. 选择 `main` 分支和 `/ (root)` 目录。
4. 保存设置。

部署完成后，可以通过 GitHub Pages 生成的地址访问网站。

## Deploy with GitHub Pages

1. Open the repository settings on GitHub.
2. Select **Pages**.
3. Choose the `main` branch and the `/ (root)` folder.
4. Save the configuration.

The site will be available at the generated GitHub Pages URL after deployment finishes.

## 作者

Reillo

## Author

Reillo
