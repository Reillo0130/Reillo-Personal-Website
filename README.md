# Reillo Personal Website

雷洛 Reillo 的个人网站，使用原生 HTML、CSS 和 JavaScript 构建。

A personal website for Reillo, built with plain HTML, CSS, and JavaScript.

## 功能

- 个人介绍
- 照片页面
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
- `photos.html` - 照片页面
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
- `photos.html` - Photos page
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
