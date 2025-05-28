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

// .gear:not(.blank):hover {
//     background-color: #868686;
//     color: #242323;
// }
{
    let lastGear;

    function gearUpdate(state) {
        console.log(state)

        if(lastGear){
            lastGear.style.backgroundColor = '#454545';
            lastGear.style.color = '#fff';
        }

        let gear;
        switch (state) {
            case -1:
                lastGear = gear = document.getElementById("gearRev");
                break;
            case 1:
                lastGear = gear = document.getElementById("gear1");
                break;
            case 2:
                lastGear = gear = document.getElementById("gear2");
                break;
            case 3:
                lastGear = gear = document.getElementById("gear3");
                break;
            case 4:
                lastGear = gear = document.getElementById("gear4");
                break;
            case 5:
                lastGear = gear = document.getElementById("gear5");
                break;
            case 6:
                lastGear = gear = document.getElementById("gear6");
                break;
            case 7:
                lastGear = gear = document.getElementById("gear7");
                break;
            default:
                break;
        }
        if (gear) {
            gear.style.backgroundColor = '#868686';
            gear.style.color = '#242323';
        }

    }

    async function loopGear() {
        let direction = 1; // -1 oznacza zmniejszanie wartości, 1 oznacza zwiększanie
        let i = -1;

        while (true) {
            await sleep(500);
            gearUpdate(i);

            if (i === -1) {
                direction = 1; // Zmiana kierunku na rosnący
            } else if (i === 7) {
                direction = -1; // Zmiana kierunku na malejący
            }

            i += direction;
        }
    }

    loopGear();
}

loopWheel();



