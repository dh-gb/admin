// To fetch OPD data from server to display on admin panel
export function initEMG() {
    fetch('https://dh-ganderbal-backend.onrender.com/api/emg')
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch Emergency data');
            return res.json();
        })
        .then(renderEMG)
        .catch(err => {
            console.error('Error loading Emergency data', err);
            alert('Error loading Emergency data. Please try again later')
        });
}


// To get data added by admin and post to server
window.addEMG = function () {
    const dept = document.getElementById('department_emg').value.trim();
    const room = document.getElementById('room_emg').value.trim();
    if (!dept || !room) {
        alert('Please fill in all details');
        return;
    }

    //To get selected items in schedule
    const selectedDays = [];
    const checkboxes = document.querySelectorAll('#schedule_emg input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            selectedDays.push(checkbox.value);
        }
    });
    if (selectedDays.length === 0) {
        alert('Please select atleast one schedule day');
        return;
    }
    const schedule = selectedDays.join(', ');

    //Send data to backend
    fetch('https://dh-ganderbal-backend.onrender.com/api/emg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dept, room, schedule }),
        credentials: 'include',
    })
        .then(res => {
            if (!res.ok) throw new Error('Failed to save Emergency data');
            return res.json();
        })
        // Clear inputs after submission
        .then(() => {
            document.getElementById('department_emg').value = '';
            document.getElementById('room_emg').value = '';
            checkboxes.forEach(cb => cb.checked = false);
            initEMG(); //Refresh the list
        })
        .catch(err => {
            console.error('Erro saving Emergency', err);
            alert('Error saving Emergency entry. Please try again')
        })
}

//Render Emergency entries

function renderEMG(data) {
    const list = document.getElementById('emgDataList');
    list.innerHTML = '';

    data.forEach((entry) => {
        const div = document.createElement('div');
        div.className = 'data-entry';
        div.setAttribute('data-id', entry._id);
        div.innerHTML = `
        <span><strong>Dept:</strong> ${entry.dept}</span>
        <span><strong>Room:</strong> ${entry.room}</span>
        <span><strong>Schedule:</strong> ${entry.schedule}</span>
        <button onClick="deleteEntryEMG('${entry._id}')">Delete</button>`;
        list.appendChild(div);
    });
}

//Delete and OPD entry
window.deleteEntryEMG = function (id) {
    const confirmDelete = confirm('Are you sure you want to delete this PDF?');
    if (!confirmDelete) return;
    fetch(`https://dh-ganderbal-backend.onrender.com/api/emg/${id}`,
        { method: 'Delete',
            credentials: 'include',
         })
        .then(res => {
            if (!res.ok) throw new Error('Failed to delete Entry');
            initEMG();
        })
        .catch(err => {
            console.error('Error deleting entry:', err);
            alert('Failed to delete entry. Please try again.');
        });
} 
