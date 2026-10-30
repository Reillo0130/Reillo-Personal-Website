if (window.__indexLoaderMode) {
    // 首页加载逻辑由 index.html 内联脚本处理，避免和其他页面加载器冲突。
} else {
function initLoaderAnimation() {
    const loader = document.querySelector('.loader-container');
    if (!loader) {
        return;
    }

    loader.style.opacity = '0';
    window.setTimeout(() => {
        loader.style.display = 'none';
        document.body.classList.add('home-entered');
        window.dispatchEvent(new CustomEvent('site-loader-finished'));
    }, 220);
}

document.addEventListener('DOMContentLoaded', initLoaderAnimation, { once: true });
}