function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function WheelUpdate(turn){
    let moveLeft = document.getElementById("wheel-progress-left");
    let moveRight = document.getElementById("wheel-progress-right");
    let rotation = document.getElementById("wheel-icon")

    let percentage = turn/540;

    if (percentage > 0){
        percentage = (1 - percentage)*100;
        moveRight.style.width = `${percentage}%`;
        console.log(percentage);
    }
    else if (percentage < 0){
        percentage = (1 + percentage)*100;
        moveLeft.style.width = `${percentage}%`;
        console.log(percentage);
    }

    // percentage = (1 - percentage)*100;




    rotation.style.transform = `rotateZ(${turn}deg)`;


}

let i = 0;

async function demo(){
    for (i = 0; i >= -540; i--) {
        await sleep(10);
        WheelUpdate(i);

        // if(i === 360) {
        //     i = 0;
        // }
    }
}

demo();
