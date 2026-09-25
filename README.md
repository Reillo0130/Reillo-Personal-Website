# Reillo Personal Website

雷洛 Reillo 的个人网站，使用原生 HTML、CSS 和 JavaScript 构建。

A personal website for Reillo, built with plain HTML, CSS, and JavaScript.

## 功能 Features

- 个人介绍 / Personal profile and introduction
- 照片页面 / Photos page
- 技术栈展示 / Technology stack showcase
- 近期行程表 / Recent itinerary table
- 每周课表 / Weekly timetable
- 按星期和时间自动高亮当前课程 / Automatic current-course highlighting based on weekday and time
- 节假日与连续休息日课表处理 / Holiday and consecutive-rest-day timetable handling
- 网站更新日志 / Changelog page with update history
- 桌面端和移动端响应式布局 / Responsive layout for desktop and mobile devices
- Liquid Glass 风格导航栏 / Liquid Glass inspired navigation bar

## 项目结构 Project Structure

- `index.html` - 首页 / Main homepage
- `css/index.css` - 首页样式 / Homepage styles
- `photos.html` - 照片页面 / Photos page
- `css/photos.css` - 照片页面样式 / Photos page styles
- `changelog.html` - 更新日志 / Website changelog
- `css/changelog.css` - 更新日志样式 / Changelog styles
- `js/course-current.js` - 当前课程和节假日课表逻辑 / Current-course and holiday timetable logic
- `js/fadeUpAnimation.js` - 页面入场动画 / Page entrance animations
- `js/collapsible-container.js` - 可折叠内容交互 / Expandable content interactions
- `js/loader-container.js` - 加载动画逻辑 / Loading screen behavior
- `assets/` - 图片、图标和背景资源 / Images, favicons, and background assets

## 本地运行 Run Locally

无需构建工具。可以直接在浏览器中打开 `index.html`，也可以使用本地服务器：

No build tools are required. Open `index.html` directly in a browser, or serve the directory with a local web server:

```powershell
python -m http.server 8000
```

然后访问 / Then visit:

```text
http://localhost:8000
```

## 部署到 GitHub Pages Deploy with GitHub Pages

1. 打开 GitHub 仓库设置 / Open the repository settings on GitHub.
2. 进入 **Pages** / Select **Pages**.
3. 选择 `main` 分支和 `/ (root)` 目录 / Choose the `main` branch and `/ (root)` folder.
4. 保存设置 / Save the configuration.

部署完成后，可以通过 GitHub Pages 生成的地址访问网站。

The site will be available at the generated GitHub Pages URL after deployment finishes.

## 作者 Author

Reillo
