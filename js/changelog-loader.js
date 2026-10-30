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

    function loadChangelog(contentNode) {
        const message = document.createElement('p');
        message.className = 'loading-tip';
        message.textContent = '正在加载更新日志...';
        contentNode.replaceChildren(message);

        const jumpWrap = document.createElement('div');
        jumpWrap.className = 'changelog-jump-wrap';
        jumpWrap.innerHTML = '<a href="changelog.html" class="jump-btn">跳转详情</a>';
        contentNode.append(jumpWrap);

        if (window.location.protocol === 'file:') {
            message.className = 'load-error';
            message.textContent = '本地 file:// 预览不支持读取其他页面的内容，请打开完整更新日志。';
            return;
        }

        fetch('changelog.html')
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`加载失败（HTTP ${res.status}）`);
                }
                return res.text();
            })
            .then(html => {
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const targetItem = Array.from(doc.querySelectorAll('.update-item[data-type="actual"][data-update-date]'))
                    .sort((a, b) => b.dataset.updateDate.localeCompare(a.dataset.updateDate))[0];

                if (targetItem) {
                    contentNode.querySelector('.loading-tip')?.remove();
                    contentNode.prepend(document.importNode(targetItem, true));
                } else {
                    message.className = 'no-data';
                    message.textContent = '暂无更新日志。';
                }
            })
            .catch(err => {
                console.error('日志加载失败:', err);
                message.className = 'load-error';
                message.textContent = `日志加载失败：${err instanceof Error ? err.message : String(err)}。可打开完整更新日志查看。`;
            });
    }
});