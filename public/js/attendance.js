import axios from 'axios'

document.addEventListener('DOMContentLoaded', () => {
    const attendance = document.querySelector('#confirm-attendance');
    if(attendance){
        attendance.addEventListener('click', confirmAttendance);
    }
})

function confirmAttendance(e) {
    e.preventDefault();

    const btn = document.querySelector('#confirm-attendance input[type="submit"]');
    let clickAction = document.querySelector('#clickAction').value;
    const message = document.querySelector('#message');

    // Cleans previous messages
    while(message.firstChild){
        message.removeChild(message.firstChild);
    }

    // Gets value

    const data = {
        clickAction
    }

    axios.post(this.action,data)
        .then(res => {
            console.log(res);
            if (clickAction === 'confirm') {
                document.querySelector('#clickAction').value = 'cancel';
                btn.value = 'Cancel Attendance';
                btn.classList.remove('btn-azul');
                btn.classList.add('btn-rojo');
            } else {
                document.querySelector('#clickAction').value = 'confirm';
                btn.value = 'Confirm Attendance';
                btn.classList.remove('btn-rojo');
                btn.classList.add('btn-azul');
            }
            // Show message
            message.appendChild(document.createTextNode(res.data));
        })
}