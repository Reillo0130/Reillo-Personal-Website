// 等 DOM 就绪后再启动打字效果，避免头部脚本早于页面元素执行
document.addEventListener('DOMContentLoaded', function() {
    const typeEl = document.getElementById('type-text');
    const textEl = typeEl?.querySelector('.typewriter-text');

    if (!typeEl || !textEl) {
        return;
    }

    const fullText = "雷破云涛惊破浪，洛水千山润锦川。";
    let currentText = "";
    let index = 0;

    const typeSpeed = 200;
    const deleteSpeed = 100;
    const pauseTime = 2000;

    function type() {
        if (index < fullText.length) {
            currentText += fullText[index];
            textEl.textContent = currentText;
            index++;
            setTimeout(type, typeSpeed);
        } else {
            setTimeout(deleteText, pauseTime);
        }
    }

    function deleteText() {
        if (currentText.length > 0) {
            currentText = currentText.slice(0, -1);
            textEl.textContent = currentText;
            setTimeout(deleteText, deleteSpeed);
        } else {
            index = 0;
            setTimeout(type, typeSpeed);
        }
    }

    type();
});