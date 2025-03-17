function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function WheelUpdate(turn){
    let moveLeft = document.getElementById("wheel-progress-left");
    let moveRight = document.getElementById("wheel-progress-right");
    let rotation = document.getElementById("wheel-icon")
    let clutch_progress = document.getElementById("clutch-progress")
    let break_progress = document.getElementById("break-progress")
    let throttle_progress = document.getElementById("throttle-progress")



    let percentage = turn/540;

    if (percentage > 0){
        percentage = (1 - percentage)*100;
        moveRight.style.width = `${percentage}%`;
        clutch_progress.style.height = `${percentage}%`;
        break_progress.style.height = `${percentage}%`;
        throttle_progress.style.height = `${percentage}%`;
        console.log(percentage);
    }
    else if (percentage < 0){
        percentage = (1 + percentage)*100;
        moveLeft.style.width = `${percentage}%`;
        clutch_progress.style.height = `${percentage}%`;
        break_progress.style.height = `${percentage}%`;
        throttle_progress.style.height = `${percentage}%`;
        console.log(percentage);
    }

    // percentage = (1 - percentage)*100;




    rotation.style.transform = `rotateZ(${turn}deg)`;


}

let i = 0;

async function loopWheel() {
    let direction = -1; // -1 oznacza zmniejszanie wartości, 1 oznacza zwiększanie
    let i = 0;

    while (true) {
        await sleep(10);
        WheelUpdate(i);

        if (i === -540) {
            direction = 1; // Zmiana kierunku na rosnący
        } else if (i === 0) {
            direction = -1; // Zmiana kierunku na malejący
        }

        i += direction;
    }
}

loopWheel();

