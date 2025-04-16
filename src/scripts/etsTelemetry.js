function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function wheelUpdate(gameSteer, userClutch, userBrake, userThrottle) {
    let moveLeft = document.getElementById("wheel-progress-left");
    let moveRight = document.getElementById("wheel-progress-right");
    let rotation = document.getElementById("wheel-icon");
    let clutch_progress = document.getElementById("clutch-progress");
    let break_progress = document.getElementById("break-progress");
    let throttle_progress = document.getElementById("throttle-progress");

    gameSteer = gameSteer * -1;

    console.log(gameSteer);
    if (gameSteer > 0){
        moveRight.style.width = `${(1-gameSteer) * 110}%`;
    }
    else if (gameSteer < 0){
        moveLeft.style.width = `${(1-(gameSteer*(-1))) * 110}%`;
    }
    clutch_progress.style.height = `${(1-userClutch) * 110}%`;
    break_progress.style.height = `${(1-userBrake) * 110}%`;
    throttle_progress.style.height = `${(1-userThrottle) * 110}%`;

    rotation.style.transform = `rotateZ(${gameSteer * 540}deg)`;
}

let lastGear;
function gearUpdate(shifterSlot) {
    // console.log(state)

    if(lastGear){
        lastGear.style.backgroundColor = '#454545';
        lastGear.style.color = '#fff';
    }

    let gear;
    switch (shifterSlot) {
        case 1:
            lastGear = gear = document.getElementById("gearRev");
            break;
        case 2:
            lastGear = gear = document.getElementById("gear1");
            break;
        case 3:
            lastGear = gear = document.getElementById("gear2");
            break;
        case 4:
            lastGear = gear = document.getElementById("gear3");
            break;
        case 5:
            lastGear = gear = document.getElementById("gear4");
            break;
        case 6:
            lastGear = gear = document.getElementById("gear5");
            break;
        case 7:
            lastGear = gear = document.getElementById("gear6");
            break;
        case 8:
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

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Błąd: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return {
            gameSteer: data.truck.gameSteer,
            userClutch: data.truck.userClutch,
            userBrake: data.truck.userBrake,
            userThrottle: data.truck.userThrottle,
            shifterSlot: data.truck.shifterSlot
        };
    } catch (error) {
        console.error("Wystąpił błąd podczas pobierania danych:", error);
        return null;
    }
}

async function loopFetch() {
    while (true) {
        await sleep(10);
        // const data = await fetchData("http://82.145.73.127:25555/api/ets2/telemetry"); // ZUT
        const data = await fetchData("http://192.168.1.11:25555/api/ets2/telemetry"); // DOM
        if (data) {
            wheelUpdate(data.gameSteer, data.userClutch, data.userBrake, data.userThrottle);
            gearUpdate(data.shifterSlot);
        }
    }
}

loopFetch();
