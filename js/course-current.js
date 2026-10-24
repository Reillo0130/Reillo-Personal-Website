document.addEventListener('DOMContentLoaded', () => {
    const table = document.querySelector('.timetable-table');

    if (!table) {
        return;
    }

    const status = table.closest('.course-table-container')
        ?.querySelector('.current-course-status');
    const detailDialog = table.closest('.course-table-container')
        ?.querySelector('.course-detail-dialog');
    const weekLabel = document.querySelector('#timetable-week');
    const courseCells = Array.from(table.querySelectorAll('tbody td[data-day]'));
    const weekdayNames = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    let lastFocusedCell = null;

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
        1: ['08:40', '09:20'],
        2: ['09:25', '10:05'],
        3: ['10:30', '11:10'],
        4: ['11:15', '11:55'],
        5: ['13:30', '14:10'],
        6: ['14:15', '14:55'],
        7: ['15:20', '16:00'],
        8: ['16:05', '16:45'],
        9: ['18:00', '18:40'],
        10: ['18:45', '19:25'],
        11: ['19:30', '20:10'],
        12: ['20:15', '20:55']
    };

    const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const getCurrentPeriod = (minutes) => Object.entries(periodTimes)
        .find(([, range]) => minutes >= timeToMinutes(range[0]) && minutes <= timeToMinutes(range[1]))?.[0];

    const formatDate = (date) => [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0')
    ].join('-');

    const getSemesterWeek = (date) => {
        const start = new Date(`${table.dataset.termStart}T00:00:00`);
        const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const totalWeeks = Number(table.dataset.termWeeks);
        const week = Math.floor((today - start) / (7 * 24 * 60 * 60 * 1000)) + 1;

        return week >= 1 && week <= totalWeeks ? week : null;
    };

    const updateCourseWeeks = (week) => {
        courseCells.forEach((cell) => {
            const alternateName = cell.querySelector('.alternate-course-name');
            const alternateNote = cell.querySelector('.alternate-course-note');

            if (alternateName && alternateNote) {
                const innovationStart = Number(cell.dataset.innovationStart);
                const innovationEnd = Number(cell.dataset.innovationEnd);
                const mentalHealthStart = Number(cell.dataset.mentalHealthStart);
                const mentalHealthEnd = Number(cell.dataset.mentalHealthEnd);
                const showMentalHealth = week !== null && week >= mentalHealthStart;
                const isActive = week !== null && (
                    showMentalHealth
                        ? week <= mentalHealthEnd
                        : week >= innovationStart && week <= innovationEnd
                );

                alternateName.textContent = showMentalHealth
                    ? '心理健康教育'
                    : '大学生创新创业教育';
                alternateNote.textContent = isActive ? '' : '非本周';
                alternateNote.classList.toggle('is-hidden', isActive);
                cell.classList.toggle('off-week', !isActive);
            }

            const activeWeeks = cell.dataset.activeWeeks
                ? cell.dataset.activeWeeks.split(',').map(Number)
                : null;
            let note = cell.querySelector('.course-week-note');

            if (activeWeeks && !note) {
                note = document.createElement('span');
                note.className = 'course-week-note';
            }

            if (activeWeeks && !alternateName) {
                const isActive = week !== null && activeWeeks.includes(week);
                if (isActive) {
                    note?.remove();
                } else {
                    note.textContent = '非本周';
                    const room = Array.from(cell.children).find((child) => child.tagName === 'SPAN'
                        && !child.classList.contains('course-count-badge')
                        && !child.classList.contains('alternate-course-note'));

                    if (room) {
                        cell.insertBefore(note, room);
                    } else {
                        cell.append(note);
                    }
                }

                cell.classList.toggle('off-week', !isActive);
            } else {
                note?.remove();
                if (!alternateName) {
                    cell.classList.remove('off-week');
                }
            }
        });
    };

    const openCourseDetails = (cell) => {
        if (!detailDialog) {
            return;
        }

        const startPeriod = Number(cell.dataset.periodStart);
        const endPeriod = Number(cell.dataset.periodEnd);
        const periods = Array.from({ length: endPeriod - startPeriod + 1 }, (_, index) => {
            return periodTimes[startPeriod + index];
        });
        const timeText = periods.map(([start, end]) => `${start}–${end}`).join('、');
        const periodText = `${weekdayNames[Number(cell.dataset.day)]} 第 ${startPeriod}${endPeriod === startPeriod ? '' : `–${endPeriod}`} 节 · ${timeText}`;
        const currentWeek = getSemesterWeek(new Date());
        const room = Array.from(cell.children)
            .filter((child) => child.tagName === 'SPAN'
                && !child.classList.contains('course-count-badge')
                && !child.classList.contains('alternate-course-note')
                && !child.classList.contains('course-week-note'))
            .at(-1)?.textContent.trim() ?? '教室待定';
        const isAlternatingCourse = cell.dataset.innovationStart !== undefined;
        const courses = isAlternatingCourse
            ? [
                {
                    name: '大学生创新创业教育',
                    isActive: currentWeek !== null
                        && currentWeek >= Number(cell.dataset.innovationStart)
                        && currentWeek <= Number(cell.dataset.innovationEnd),
                    teacher: cell.dataset.teacher ?? '未提供'
                },
                {
                    name: '大学生心理健康教育',
                    isActive: currentWeek !== null
                        && currentWeek >= Number(cell.dataset.mentalHealthStart)
                        && currentWeek <= Number(cell.dataset.mentalHealthEnd),
                    teacher: cell.dataset.teacher ?? '未提供'
                }
            ]
            : [{
                name: cell.querySelector('strong')?.textContent.trim() ?? '课程',
                isActive: cell.dataset.activeWeeks
                    ? currentWeek !== null && cell.dataset.activeWeeks.split(',').map(Number).includes(currentWeek)
                    : true,
                teacher: cell.dataset.teacher ?? '未提供'
            }];

        const title = detailDialog.querySelector('#course-detail-title');
        const content = detailDialog.querySelector('.course-detail-content');
        title.textContent = isAlternatingCourse ? '课程安排（2 门）' : courses[0].name;
        content.replaceChildren();

        courses.forEach((course) => {
            const item = document.createElement('section');
            item.className = 'course-detail-item';

            const name = document.createElement('h5');
            name.textContent = course.name;

            const fieldsElement = document.createElement('dl');
            const fieldsList = [
                ...(!course.isActive ? [['课程周期', '非本周']] : []),
                ['课程节数', periodText],
                ['上课地点', room],
                ['授课老师', course.teacher]
            ];

            fieldsList.forEach(([labelText, valueText]) => {
                const field = document.createElement('div');
                const label = document.createElement('dt');
                const value = document.createElement('dd');
                label.textContent = labelText;
                value.textContent = valueText;
                field.append(label, value);
                fieldsElement.append(field);
            });

            item.append(name, fieldsElement);
            content.append(item);
        });

        lastFocusedCell = cell;
        detailDialog.showModal();
    };

    if (detailDialog) {
        const closeButton = detailDialog.querySelector('.course-detail-close');
        closeButton.addEventListener('click', () => detailDialog.close());
        detailDialog.addEventListener('click', (event) => {
            if (event.target === detailDialog) {
                detailDialog.close();
            }
        });
        detailDialog.addEventListener('close', () => lastFocusedCell?.focus());
    }

    courseCells.forEach((cell) => {
        cell.tabIndex = 0;
        cell.setAttribute('aria-haspopup', 'dialog');
        cell.addEventListener('click', () => openCourseDetails(cell));
        cell.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openCourseDetails(cell);
            }
        });
    });

    const updateCurrentCourse = () => {
        const now = table.dataset.demoDate
            ? new Date(`${table.dataset.demoDate}T${new Date().toTimeString().slice(0, 8)}`)
            : new Date();
        const weekday = now.getDay();
        const minutes = now.getHours() * 60 + now.getMinutes();
        const date = formatDate(now);
        const currentPeriod = getCurrentPeriod(minutes);
        const week = getSemesterWeek(now);

        if (weekLabel) {
            weekLabel.textContent = week === null
                ? '当前不在学期周内'
                : `第 ${week} 周 / 共 ${table.dataset.termWeeks} 周`;
        }
        updateCourseWeeks(week);

        courseCells.forEach((cell) => cell.classList.remove('current-course'));

        if (!status) {
            return;
        }

        status.classList.add('no-course');

        if (weekday === 0 || weekday === 6) {
            status.textContent = '今天无课程';
            return;
        }

        if (holidayDates.has(date)) {
            status.textContent = '今天是节假日，无课程';
            return;
        }

        if (!currentPeriod) {
            status.textContent = '当前时段无课程';
            return;
        }

        const courseCell = courseCells.find((cell) => {
            return Number(cell.dataset.day) === weekday
                && currentPeriod >= Number(cell.dataset.periodStart)
                && currentPeriod <= Number(cell.dataset.periodEnd);
        });

        if (!courseCell) {
            status.textContent = `第 ${currentPeriod} 节无课程`;
            return;
        }

        courseCell.classList.add('current-course');
        if (courseCell.classList.contains('off-week')) {
            status.textContent = `第 ${currentPeriod} 节：${courseCell.querySelector('strong')?.textContent ?? '课程'}（非本周）`;
            return;
        }

        status.textContent = `当前课程：${courseCell.querySelector('strong')?.textContent ?? '课程'}`;
        status.classList.remove('no-course');
    };

    updateCurrentCourse();
    window.setInterval(updateCurrentCourse, 30000);
});