// 声明防抖定时器变量，用于控制滚动事件触发频率
let timeout;

/**
 * 检查元素碰撞逻辑的函数
 * 主要处理各容器、按钮与头部导航栏的碰撞检测及样式调整
 */
function checkCollision() {
    // 获取头部导航栏元素及其位置信息（相对于视口的坐标）
    const header = document.querySelector('header');
    const headerRect = header.getBoundingClientRect();
    
    // 获取所有需要检测的容器元素（.container, .container1, .container2）
    const containers = document.querySelectorAll('.container, .container1, .container2');
    
    // 获取圆形按钮元素
    const roundBtn = document.querySelector('.round-btn');

    // 处理普通容器与头部导航栏的碰撞逻辑
    containers.forEach(container => {
        // 获取当前容器的位置信息
        const rect = container.getBoundingClientRect();
        // 判断容器是否与头部导航栏发生碰撞（垂直方向有重叠）
        const isCollide = rect.top <= headerRect.bottom && rect.bottom >= headerRect.top;
        // 根据碰撞状态切换colliding类（控制半透明效果）
        container.classList.toggle('colliding', isCollide);
    });

    // 单独处理container1的碰撞条件（特殊逻辑）
    const container1 = document.querySelector('.container1');
    if (container1) {
        const rect1 = container1.getBoundingClientRect();
        // 仅当container1底部与头部导航栏重叠时判定为碰撞
        const isCollide1 = rect1.bottom <= headerRect.bottom && rect1.bottom >= headerRect.top;
        container1.classList.toggle('colliding', isCollide1);
    }

    // 处理container1的透明度调整（当从一半高度到底到底部与头部重叠时）
    if (container1) {
        const container1Rect = container1.getBoundingClientRect();
        // 计算container1的中点高度（顶部到中点的位置）
        const container1MidHeight = container1Rect.top + (container1Rect.bottom - container1Rect.top) / 2;
        // 判断条件：container1中点到底部的区域与头部导航栏有重叠
        const isHalfToBottomCollide = 
            container1MidHeight <= headerRect.bottom &&  // 中点以下进入头部范围
            container1Rect.bottom >= headerRect.top;     // 底部未完全离开头部
        
        // 根据碰撞状态设置container1的透明度
        if (isHalfToBottomCollide) {
            container1.style.opacity = '0.3';  // 碰撞时半透明
        } else {
            container1.style.opacity = '1';    // 未碰撞时不透明
        }
    }

    // 处理content-inner的透明度调整（核心逻辑：仅自身中点到底部与头部重叠时）
    const contentInner = document.querySelector('.content-inner');
    if (contentInner) {
        const innerRect = contentInner.getBoundingClientRect();
        // 计算content-inner的中点高度
        const innerMidHeight = innerRect.top + (innerRect.bottom - innerRect.top) / 2;
        // 判断条件：content-inner中点到底部的区域与头部导航栏有重叠
        const isInnerHalfToBottomCollide = 
            innerMidHeight <= headerRect.bottom &&  // 中点以下进入头部范围
            innerRect.bottom >= headerRect.top;     // 底部未完全离开头部
        
        // 仅调整content-inner自身的透明度
        if (isInnerHalfToBottomCollide) {
            contentInner.style.opacity = '0.3';  // 碰撞时半透明
        } else {
            contentInner.style.opacity = '1';    // 未碰撞时不透明
        }
    }

    // 处理圆形按钮与头部导航栏的碰撞逻辑
    if (roundBtn) {
        const btnRect = roundBtn.getBoundingClientRect();
        // 判断按钮是否与头部导航栏发生碰撞（垂直方向有重叠）
        const isBtnCollideWithHeader = 
            btnRect.top <= headerRect.bottom && 
            btnRect.bottom >= headerRect.top;
        
        // 根据碰撞状态调整按钮样式
        if (isBtnCollideWithHeader) {
            roundBtn.style.opacity = '0.3';       // 碰撞时半透明
            roundBtn.style.pointerEvents = 'none';// 碰撞时禁止点击
        } else {
            roundBtn.style.opacity = '1';         // 未碰撞时不透明
            roundBtn.style.pointerEvents = 'auto';// 未碰撞时允许点击
        }
    }
}

// 监听页面滚动事件，添加防抖处理（避免滚动时频繁执行检测）
window.addEventListener('scroll', () => {
    // 清除上一次的定时器，确保只有最后一次滚动事件触发后才执行
    clearTimeout(timeout);
    // 延迟50毫秒执行碰撞检测，减少性能消耗
    timeout = setTimeout(checkCollision, 50);
});

// 页面初始加载时执行一次碰撞检测，确保初始状态正确
checkCollision();