// 当整个页面（包括图片、脚本等所有资源）加载完成后执行
window.onload = function() {
    // 获取加载动画容器元素
    const loader = document.querySelector('.loader-container');
    
    // 将加载动画容器的透明度设置为0，触发CSS中定义的opacity过渡动画（淡出效果）
    loader.style.opacity = '0';
    
    // 延迟500毫秒执行（与CSS中loader-container的transition: opacity 0.5s ease时长保持一致）
    setTimeout(() => {
        // 完全隐藏加载动画容器（display: none会从文档流中移除元素）
        loader.style.display = 'none';
        
        // 显示页面主内容（假设存在类名为content的主内容容器，初始可能为隐藏状态）
        document.querySelector('.content').style.display = 'block';
    }, 500);
};