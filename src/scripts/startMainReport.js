// obsługa przycisku start/stop dla testu
window.addEventListener('DOMContentLoaded', () => {
    let button = document.getElementById('start-stop-button');
    let timer = document.getElementById('timer-container');
    let telemetryFlag = false;
    let userData;
    button.addEventListener('click',  (e) => {
        if (button.innerText === 'Start') {
            let {div, form} = initTestForm();

            form.addEventListener('submit', (e) => {
                e.preventDefault();

                let formData = new FormData(form);
                userData = Object.fromEntries(formData.entries());
                userData = Object.values(userData);
                console.log(userData[0]);

                div.remove();
                StartToStop(button, timer);
                window.electronAPI.startPHP();


            })
        }
        else if (button.innerText === 'Stop') {
            StopToStart(button, timer);
            window.electronAPI.stopPHP();
            setTimeout(() => {
                window.electronAPI.startPython(userData);
            }, 5000);
        }


    })
})

// tworzenie formularza
function initTestForm() {
    if (!document.getElementById('setNames')) {
        let div = document.createElement('div');
        div.id = 'setNames';

        // Stylizacja kontenera
        div.style.position = 'absolute';
        div.style.top = '30%';
        div.style.left = '50%';
        div.style.transform = 'translate(-50%, -50%)';
        div.style.width = '25%';
        div.style.height = 'auto';
        div.style.padding = '20px';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.gap = '10px';
        div.style.backgroundColor = '#2a2a2a';
        div.style.border = '1px solid #9c9c9c';
        div.style.borderRadius = '8px';
        div.style.boxShadow = '2px 0 8px rgba(0, 0, 0, 0.3)';
        div.style.fontFamily = 'sans-serif';
        div.style.color = '#fff';
        div.style.zIndex = '100';


        // Form
        let form = document.createElement('form');
        form.id = 'setNamesForm';


        // Input 1
        let label1 = document.createElement('label');
        label1.textContent = 'Username: ';
        label1.htmlFor = 'userName';

        let input1 = document.createElement('input');
        input1.type = 'text';
        input1.id = 'userName';
        input1.name = 'userName';
        input1.placeholder = 'user-1';
        input1.style.padding = '6px 2%';
        input1.style.borderRadius = '4px';
        input1.style.border = '1px solid #ccc';
        input1.style.width = '95%';

        // Input 2
        let label2 = document.createElement('label');
        label2.textContent = 'Test name:';
        label2.htmlFor = 'testName';

        let input2 = document.createElement('input');
        input2.type = 'text';
        input2.id = 'testName';
        input2.name = 'testName';
        input2.placeholder = 'test-1';
        input2.style.padding = '6px 2%';
        input2.style.borderRadius = '4px';
        input2.style.border = '1px solid #ccc';
        input2.style.width = '95%';

        // Button
        let button = document.createElement('button');
        button.textContent = 'Submit';
        button.style.padding = '8px 0';
        button.style.width = '100%';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.backgroundColor = '#4caf50';
        button.style.color = '#fff';
        button.style.cursor = 'pointer';
        button.style.marginTop = '1rem';


        // Dodanie elementów do diva
        div.appendChild(form);
        form.appendChild(label1);
        form.appendChild(input1);
        form.appendChild(label2);
        form.appendChild(input2);
        form.appendChild(button);

        document.body.appendChild(div);

        return { div, form };

    }
}


