// 当DOM文档结构加载完成后执行（无需等待图片等资源加载完成）
document.addEventListener('DOMContentLoaded', function() {
    // 获取id为downBtn的按钮元素（触发滚动的按钮）
    const downBtn = document.getElementById('downBtn');
    // 获取id为targetSection的目标区域元素（要滚动到的位置）
    const targetSection = document.getElementById('targetSection');

    // 给按钮添加点击事件监听
    downBtn.addEventListener('click', function() {
        // 调用scrollIntoView方法平滑滚动到目标区域
        targetSection.scrollIntoView({
            behavior: 'smooth', // 滚动行为：平滑滚动（而非瞬间跳转）
            block: 'start' // 对齐方式：目标区域顶部与视口顶部对齐
        });
    });
});