document.addEventListener('DOMContentLoaded', () => {
    const uptime = document.querySelector('[data-uptime]');

    if (!uptime) {
        return;
    }

    const launchTime = new Date('2025-10-25T00:00:00+08:00');
    const daysElement = uptime.querySelector('[data-days]');
    const hoursElement = uptime.querySelector('[data-hours]');
    const minutesElement = uptime.querySelector('[data-minutes]');
    const secondsElement = uptime.querySelector('[data-seconds]');
    const updatedElement = document.querySelector('[data-updated]');

    document.querySelectorAll('[data-availability]').forEach((bar) => {
        const availability = Number(bar.dataset.availability);
        const isAvailable = availability > 0;

        for (let index = 0; index < 90; index += 1) {
            const day = document.createElement('span');
            day.className = isAvailable ? 'availability-day' : 'availability-day unavailable';
            day.setAttribute('aria-hidden', 'true');
            bar.appendChild(day);
        }
    });

    const updateUptime = () => {
        const elapsed = Math.max(0, Date.now() - launchTime.getTime());
        const totalSeconds = Math.floor(elapsed / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        daysElement.textContent = days;
        hoursElement.textContent = String(hours).padStart(2, '0');
        minutesElement.textContent = String(minutes).padStart(2, '0');
        secondsElement.textContent = String(seconds).padStart(2, '0');

        if (updatedElement) {
            updatedElement.textContent = new Date().toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    };

    updateUptime();
    window.setInterval(updateUptime, 1000);
});
