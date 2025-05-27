let interval = null;

function StartToStop(button, timer) {
    button.innerText = 'Stop';
    button.style.backgroundColor = '#dc3636';

    let start = Date.now();
    let time = 0;
    interval = setInterval(function() {
        time = Date.now() - start;
        let minutes = Math.floor(time / 60000);
        let seconds = Math.floor((time % 60000) / 1000);
        let centiSeconds = Math.floor((time % 1000) / 10);

        let minStr = minutes.toString().padStart(2, '0');
        let secStr = seconds.toString().padStart(2, '0');
        let centiStr = centiSeconds.toString().padStart(2, '0');

        timer.innerText = `${minStr}:${secStr}:${centiStr}`;

    }, 10);

}

function StopToStart(button, timer) {
    button.innerText = 'Start';
    button.style.backgroundColor = '#44c767';
    clearInterval(interval);
    timer.innerText = '00:00:00'
}



