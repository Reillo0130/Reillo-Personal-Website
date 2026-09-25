// 等待DOM完全加载后执行，避免操作未渲染元素
document.addEventListener('DOMContentLoaded', function() {
    // 核心修改：新增.intro精准匹配，确保该p标签必生效，其余选择器全部保留
    const animateElements = document.querySelectorAll(
        'h1, h2, h3, p, .intro, .latest-update, .major-events, .history-updates, .plan-updates, .usage-note, .back-to-home'
    );

    // 为每个元素初始化动画初始状态（仅叠加动画样式，不覆盖原有样式）
    animateElements.forEach(el => {
        Object.assign(el.style, {
            opacity: '0',
            transform: 'translateY(40px)',
            willChange: 'opacity, transform',
            transition: 'none'
        });
    });

    // 逐元素延迟触发动画（错开执行，自然不生硬，参数未改动）
    animateElements.forEach((el, index) => {
        setTimeout(() => {
            Object.assign(el.style, {
                opacity: '1',
                transform: 'translateY(0)',
                transition: 'opacity 0.7s ease, transform 0.7s ease'
            });
        }, 100 + index * 150); // 初始延迟100ms，元素间隔150ms触发
    });
});