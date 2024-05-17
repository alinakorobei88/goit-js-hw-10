import flatpickr from "flatpickr";
import iziToast from "izitoast";
import "flatpickr/dist/flatpickr.min.css";
import "izitoast/dist/css/iziToast.min.css";

document.addEventListener('DOMContentLoaded', () => {
    const datePicker = document.getElementById('datetime-picker');
    const startBtn = document.querySelector('[data-start]');
    const daysSpan = document.querySelector('[data-days]');
    const hoursSpan = document.querySelector('[data-hours]');
    const minutesSpan = document.querySelector('[data-minutes]');
    const secondsSpan = document.querySelector('[data-seconds]');

    let userSelectedDate;

    // Функція для додавання ведучого нуля, якщо значення менше двох цифр
    function addLeadingZero(value) {
        return value.toString().padStart(2, '0');
    }

    // Ініціалізація календаря
    flatpickr(datePicker, {
        enableTime: true,
        time_24hr: true,
        defaultDate: new Date(),
        minuteIncrement: 1,
        onClose(selectedDates) {
            userSelectedDate = selectedDates[0];
            const currentDate = new Date();
    
            if (userSelectedDate <= currentDate) {
                iziToast.error({
                    title: 'Error',
                    message: 'Please choose a future date!',
                    position: 'topRight'
                });
                startBtn.disabled = true;
            } else {
                startBtn.disabled = false;
            }
        },
        clickOpens: true // Календар відкриється при кліку на поле вводу
    });

    // Обробник кліку на кнопку Start
    startBtn.addEventListener('click', () => {
        startBtn.disabled = true;
        datePicker.disabled = true;

        // Функція для оновлення таймера
        function updateTimer() {
            const now = new Date();
            const timeDifference = userSelectedDate - now;

            if (timeDifference <= 0) {
                clearInterval(timerInterval);
                startBtn.disabled = false;
                datePicker.disabled = false;
                iziToast.success({
                    title: 'Countdown Finished',
                    message: 'The countdown has ended!',
                    position: 'topRight'
                });
                return;
            }

            const { days, hours, minutes, seconds } = convertMs(timeDifference);

            daysSpan.textContent = addLeadingZero(days);
            hoursSpan.textContent = addLeadingZero(hours);
            minutesSpan.textContent = addLeadingZero(minutes);
            secondsSpan.textContent = addLeadingZero(seconds);
        }

        updateTimer(); // Оновлення таймера перед першим інтервалом

        const timerInterval = setInterval(updateTimer, 1000); // Оновлення таймера кожну секунду
    });
});

// Функція для конвертації мілісекунд у дні, години, хвилини та секунди
function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}