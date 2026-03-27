let userId = localStorage.getItem("userId");

function register() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    
    fetch('/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: username, password: password})
    }).then(res => res.json())
    .then(data => alert('Registered! Now login.'));
}

function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    
    fetch('/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: username, password: password})
    }).then(res => res.json())
    .then(data => {
        localStorage.setItem('userId', data.id);
        window.location.href = 'dashboard.html';
    });
}

function addJob() {
    let company = document.getElementById('company').value;
    let role = document.getElementById('role').value;
    let status = document.getElementById('status').value;
    
    fetch('/jobs', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userId: userId, company: company, role: role, status: status})
    }).then(res => res.json())
    .then(data => loadJobs());
}

function loadJobs() {
    fetch('/jobs/' + userId)
    .then(res => res.json())
    .then(data => {
        let list = document.getElementById('jobs');
        list.innerHTML = '';
        for (let i = 0; i < data.length; i++) {
            let job = data[i];
            let li = document.createElement('li');
            li.innerHTML = job.company + ' - ' + job.role + ' (' + job.status + ') <button onclick="deleteJob(' + job.id + ')">Delete</button>';
            list.appendChild(li);
        }
    });
}

function deleteJob(id) {
    fetch('/jobs/' + id, {method: 'DELETE'})
    .then(res => res.json())
    .then(data => loadJobs());
}

if (window.location.pathname.includes('dashboard.html')) {
    loadJobs();
}