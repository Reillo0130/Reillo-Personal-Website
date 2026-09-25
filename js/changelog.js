document.addEventListener('DOMContentLoaded', function() {
    // 1. 最新更新同步功能
    const actualUpdates = document.querySelectorAll('.update-item[data-type="actual"]');
    const latestContainer = document.getElementById('latestContainer');
    
    if (actualUpdates.length > 0 && latestContainer) {
        const sortedUpdates = Array.from(actualUpdates).sort((a, b) => {
            const dateA = a.getAttribute('data-update-date');
            const dateB = b.getAttribute('data-update-date');
            return dateB.localeCompare(dateA);
        });
        const latestUpdate = sortedUpdates[0].cloneNode(true);
        latestContainer.appendChild(latestUpdate);
    }

    // 2. 历史更新折叠/展开功能
    const historyToggle = document.querySelector('.history-toggle-container');
    const historyContent = document.getElementById('historyContent');
    const historyIcon = historyToggle ? historyToggle.querySelector('.toggle-icon') : null;
    
    if (historyToggle && historyContent && historyIcon) {
        historyContent.classList.remove('expanded');
        historyIcon.textContent = '▼';
        
        historyToggle.addEventListener('click', function() {
            const isExpanded = historyContent.classList.toggle('expanded');
            historyIcon.textContent = isExpanded ? '▲' : '▼';
        });
    }

    // 3. 新增：重大事件折叠/展开功能
    const majorToggle = document.querySelector('.major-toggle-container');
    const majorContent = document.getElementById('majorContent');
    const majorIcon = majorToggle ? majorToggle.querySelector('.toggle-icon') : null;
    
    if (majorToggle && majorContent && majorIcon) {
        majorContent.classList.remove('expanded'); // 默认折叠
        majorIcon.textContent = '▼';
        
        majorToggle.addEventListener('click', function() {
            const isExpanded = majorContent.classList.toggle('expanded');
            majorIcon.textContent = isExpanded ? '▲' : '▼';
        });
    }
});