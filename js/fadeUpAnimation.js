// 等待页面DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 1. 定义需要添加动画的容器列表（匹配你页面中的所有容器类名）
    const containerSelectors = [
        '.container1',
        '.container2',
        '.collapsible-container',
        '.container3',
        '.course-table-container',
        '.Friendship-Links-container',
        '.Copyright-container'
    ];

    // 2. 合并选择器并获取所有容器元素
    const allContainers = document.querySelectorAll(containerSelectors.join(','));

    // 3. 为每个容器初始化动画样式（不影响原有样式，仅添加动画相关属性）
    allContainers.forEach((container, index) => {
        // 初始状态：隐藏在下方 + 透明（不修改原有样式，仅叠加）
        Object.assign(container.style, {
            opacity: '0',
            transform: 'translateY(50px)',
            transition: 'none', // 先清空原有transition，避免冲突
            willChange: 'opacity, transform' // 性能优化
        });

        // 4. 延迟触发动画（每个容器错开0.2秒，避免同步）
        setTimeout(() => {
            Object.assign(container.style, {
                opacity: '1',
                transform: 'translateY(0)',
                transition: 'opacity 0.8s ease, transform 0.8s ease' // 渐入动画
            });
        }, 100 + index * 200); // 初始延迟100ms，每个容器间隔200ms
    });

    // 5. 为每个元素添加reveal-item类名，以便后续控制
    const selectors = [
        '.container1',
        '.container2',
        '.collapsible-container',
        '.container3',
        '.course-table-container',
        '.Friendship-Links-container',
        '.Copyright-container'
    ];

    const items = Array.from(document.querySelectorAll(selectors.join(',')));

    items.forEach((el, index) => {
        el.classList.add('reveal-item');

        setTimeout(() => {
            el.classList.add('is-visible');
        }, 120 + index * 180);
    });
});