if (window.__indexLoaderMode) {
    // 首页加载逻辑由 index.html 内联脚本处理，避免和其他页面加载器冲突。
} else {
// 让加载页进度条先运动，再在页面真正加载完成后淡出
function initLoaderAnimation() {
    const loader = document.querySelector('.loader-container');
    const progressFill = document.querySelector('.loader-progress-fill');
    const progressLabel = document.querySelector('.loader-progress-meta span:last-child');

    if (!loader || !progressFill || !progressLabel) {
        return;
    }

    let currentProgress = 0;
    let progressTimer = null;
    let loaded = false;
    let finishScheduled = false;

    const renderProgress = (value) => {
        const clampedValue = Math.max(0, Math.min(100, value));
        currentProgress = clampedValue;
        progressFill.style.width = `${clampedValue}%`;
        progressLabel.textContent = `${Math.round(clampedValue)}%`;
    };

    const fadeOutLoader = () => {
        loader.style.opacity = '0';

        setTimeout(() => {
            document.body.classList.add('home-entered');
            loader.style.display = 'none';
        }, 500);
    };

    const finishLoading = () => {
        if (finishScheduled) {
            return;
        }
        finishScheduled = true;

        if (progressTimer) {
            window.clearInterval(progressTimer);
            progressTimer = null;
        }

        const startValue = currentProgress;
        const startTime = performance.now();
        const duration = 280;

        const completeStep = (now) => {
            const elapsed = now - startTime;
            const ratio = Math.min(1, elapsed / duration);
            const nextValue = startValue + (100 - startValue) * ratio;
            renderProgress(nextValue);

            if (ratio < 1) {
                requestAnimationFrame(completeStep);
                return;
            }

            setTimeout(fadeOutLoader, 180);
        };

        requestAnimationFrame(completeStep);
    };

    progressFill.style.width = '0%';
    progressFill.style.transition = 'width 0.08s linear';
    progressLabel.textContent = '0%';

    progressTimer = window.setInterval(() => {
        if (loaded) {
            return;
        }

        if (currentProgress >= 92) {
            return;
        }

        renderProgress(currentProgress + 2 + Math.random() * 3);
    }, 80);

    window.addEventListener('load', function() {
        loaded = true;
        finishLoading();
    }, { once: true });

    window.setTimeout(() => {
        if (!finishScheduled) {
            loaded = true;
            finishLoading();
        }
    }, 2400);
}

function waitForLoaderElements() {
    const loader = document.querySelector('.loader-container');
    const progressFill = document.querySelector('.loader-progress-fill');
    const progressLabel = document.querySelector('.loader-progress-meta span:last-child');

    if (!loader || !progressFill || !progressLabel) {
        window.requestAnimationFrame(waitForLoaderElements);
        return;
    }

    initLoaderAnimation();
}

waitForLoaderElements();
}