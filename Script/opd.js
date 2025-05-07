// To fetch OPD data from server to display on admin panel
export function initOPD() {
    fetch('https://dh-ganderbal-backend.onrender.com/api/opd')
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch OPD data');
            return res.json();
        })
        .then(renderOPD)
        .catch(err => {
            console.error('Error loading OPD data', err);
            alert('Error loading OPD data. Please try again later')
        });
}


// To get data added by admin and post to server
window.addOPD = function () {
    const dept = document.getElementById('department_opd').value.trim();
    const room = document.getElementById('room_opd').value.trim();
    if (!dept || !room) {
        alert('Please fill in all details');
        return;
    }

    //To get selected items in schedule
    const selectedDays = [];
    const checkboxes = document.querySelectorAll('#schedule_opd input[type="checkbox"]');

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
    fetch('https://dh-ganderbal-backend.onrender.com/api/opd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dept, room, schedule }),
        credentials: 'include',
    })
        .then(res => {
            if (!res.ok) throw new Error('Failed to save OPD data');
            return res.json();
        })
        // Clear inputs after submission
        .then(() => {
            document.getElementById('department_opd').value = '';
            document.getElementById('room_opd').value = '';
            checkboxes.forEach(cb => cb.checked = false);
            initOPD(); //Refresh the list
        })
        .catch(err => {
            console.error('Erro saving OPD entry', err);
            alert('Error saving OPD entry. Please try again')
        })
}

//Render OPD entries

function renderOPD(data) {
    const list = document.getElementById('opdDataList');
    list.innerHTML = '';

    data.forEach((entry) => {
        const div = document.createElement('div');
        div.className = 'data-entry';
        div.setAttribute('data-id', entry._id);
        div.innerHTML = `
        <span><strong>Dept:</strong> ${entry.dept}</span>
        <span><strong>Room:</strong> ${entry.room}</span>
        <span><strong>Schedule:</strong> ${entry.schedule}</span>
        <button onClick="deleteEntryOPD('${entry._id}')">Delete</button>`;
        list.appendChild(div);
    });
}

//Delete and OPD entry
window.deleteEntryOPD = function (id) {
    const confirmDelete = confirm('Are you sure you want to delete this PDF?');
    if (!confirmDelete) return;
    fetch(`https://dh-ganderbal-backend.onrender.com/api/opd/${id}`,
        {
            method: 'Delete',
            credentials: 'include',
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to delete Entry');
            initOPD();
        })
        .catch(err => {
            console.error('Error deleting entry:', err);
            alert('Failed to delete entry. Please try again.');
        });
} 
