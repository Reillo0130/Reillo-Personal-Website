// 仅针对「网站更新日志」容器生效，不影响技术栈容器
document.addEventListener('DOMContentLoaded', function() {
    // 只获取更新日志容器（通过唯一ID）
    const changelogContainer = document.getElementById('changelog-container');
    if (!changelogContainer) return; // 找不到则直接退出，避免报错

    // 1. 为更新日志容器创建content节点（如果没有）
    let content = changelogContainer.querySelector('.collapsible-content');
    if (!content) {
        content = document.createElement('div');
        content.className = 'collapsible-content';
        content.style.display = 'none';
        changelogContainer.appendChild(content);
    }

    // 2. 绑定更新日志容器的点击事件
    const header = changelogContainer.querySelector('.collapsible-header');
    if (header) {
        header.addEventListener('click', function() {
            // 切换显示/隐藏
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            
            // 切换指示器样式（仅更新日志容器）
            const triangle = changelogContainer.querySelector('.triangle');
            const chevron = changelogContainer.querySelector('.chevron');
            if (triangle) triangle.classList.toggle('rotate', isHidden);
            if (chevron) chevron.classList.toggle('rotate', isHidden);

            // 加载更新日志内容（仅首次展开时加载）
            if (isHidden && content.innerHTML === '') {
                loadChangelog(content);
            }
        });
    }

    // 加载更新日志的核心函数
    function loadChangelog(contentNode) {
        // 先显示加载提示
        contentNode.innerHTML = `
            <div class="content-inner" id="changelogContent">
                <div class="loading-tip">正在加载更新日志...</div>
            </div>
            <div class="changelog-jump-wrap">
                <a href="changelog.html" class="jump-btn">跳转详情</a>
            </div>
        `;

        // 加载changelog.html中2026-02-01的更新内容
        fetch('changelog.html')
            .then(res => res.ok ? res.text() : Promise.reject('加载失败'))
            .then(html => {
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const targetItem = doc.querySelector('.update-item[data-update-date="2026-02-01"]');
                const changelogContent = document.getElementById('changelogContent');
                
                if (targetItem) {
                    changelogContent.innerHTML = targetItem.outerHTML;
                } else {
                    changelogContent.innerHTML = '<p class="no-data">暂无2026年更新日志</p>';
                }
            })
            .catch(err => {
                console.error('日志加载失败:', err);
                document.getElementById('changelogContent').innerHTML = '<p class="load-error">日志加载失败，点击「跳转详情」查看</p>';
            });
    }
});