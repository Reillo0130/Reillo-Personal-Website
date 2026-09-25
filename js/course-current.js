document.addEventListener('DOMContentLoaded', () => {
    const table = document.querySelector('.timetable-table');

    if (!table) {
        return;
    }

    const status = table.closest('.course-table-container')
        ?.querySelector('.current-course-status');

    const originalCourseText = new Map();

    table.querySelectorAll('tbody td').forEach((cell) => {
        if (cell.textContent.trim() === '—') {
            cell.textContent = '-';
        }

        originalCourseText.set(cell, cell.textContent);
    });

    const holidayDates = new Set([
        '2026-10-01',
        '2026-10-02',
        '2026-10-03',
        '2026-10-04',
        '2026-10-05',
        '2026-10-06',
        '2026-10-07',
        '2027-01-01',
        '2027-05-01'
    ]);

    const periodTimes = {
        '1-2节': [['08:30', '09:55']],
        '3-4节': [['10:00', '11:35']],
        '5-6节': [['11:35', '12:15'], ['13:30', '14:10']],
        '7-8节': [['14:15', '15:50']],
        '9-10节': [['15:55', '16:35'], ['18:00', '18:40']],
        '11节': [['18:45', '19:25']]
    };

    const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const getCurrentPeriod = (minutes) => Object.entries(periodTimes)
        .find(([, ranges]) => {
            return ranges.some((range) => {
                const start = timeToMinutes(range[0]);
                const end = timeToMinutes(range[1]);
                return minutes >= start && minutes <= end;
            });
        })?.[0];

    const formatDate = (date) => [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0')
    ].join('-');

    const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    const updateCurrentCourse = () => {
        originalCourseText.forEach((text, cell) => {
            cell.textContent = text;
        });

        table.querySelectorAll('td.current-course').forEach((cell) => {
            cell.classList.remove('current-course');
        });
        table.querySelectorAll('td.no-course-cell').forEach((cell) => {
            if (cell.textContent.trim() === '无课') {
                cell.textContent = '-';
            }
            cell.classList.remove('no-course-cell');
        });

        if (status) {
            status.textContent = '无课';
            status.classList.add('no-course');
        }

        const now = table.dataset.demoDate
            ? new Date(`${table.dataset.demoDate}T10:20:00`)
            : new Date();
        const weekday = now.getDay();
        const minutes = now.getHours() * 60 + now.getMinutes();
        const date = formatDate(now);
        const currentPeriod = getCurrentPeriod(minutes);

        const rows = Array.from(table.tBodies[0]?.rows ?? []);
        const isRestDay = (day) => day === 0 || day === 6 || holidayDates.has(formatDate(day));

        if (weekday >= 1 && weekday <= 5 && isRestDay(now)) {
            rows.forEach((item) => {
                const currentDayCell = item.cells[weekday];

                if (currentDayCell) {
                    currentDayCell.textContent = '-';
                    currentDayCell.classList.remove('current-course', 'no-course-cell');
                }
            });

            for (let day = weekday + 1; day <= 7; day += 1) {
                const futureDate = addDays(now, day - weekday);

                if (!isRestDay(futureDate)) {
                    break;
                }

                rows.forEach((item) => {
                    const futureDayCell = item.cells[day];

                    if (futureDayCell) {
                        futureDayCell.textContent = '-';
                        futureDayCell.classList.remove('current-course', 'no-course-cell');
                    }
                });
            }
        }

        if (weekday === 0 || weekday === 6 || !currentPeriod) {
            return;
        }

        const row = rows.find((item) => item.cells[0]?.textContent.trim() === currentPeriod);

        if (!row) {
            return;
        }

        const courseCell = row.cells[weekday];

        if (holidayDates.has(date)) {
            courseCell.textContent = '无课';
            courseCell.classList.add('no-course-cell');
            return;
        }

        if (courseCell && courseCell.textContent.trim() !== '-') {
            courseCell.classList.add('current-course');

            if (status) {
                status.textContent = `当前课程：${courseCell.textContent.trim()}`;
                status.classList.remove('no-course');
            }
        } else {
            if (courseCell) {
                courseCell.textContent = '无课';
                courseCell.classList.add('no-course-cell');
            }
        }
    };

    updateCurrentCourse();
    window.setInterval(updateCurrentCourse, 30000);
});