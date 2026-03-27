let userId = localStorage.getItem("userId");

function register() {
    fetch('register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        })
    })
    .then(res => res.json())
    .then(data => alert("Registration successful. Please log in."));
}

function login() {
    fetch('login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        })
    })
    .then(res => res.json())
    .then(data => {
            localStorage.setItem("userId", data.id);
            window.location.href = "dashboard.html";
        
    });
}

function addJob() {
    fetch('/jobs', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            userId,
            company: document.getElementById('company').value,
            role: document.getElementById('role').value,
            status: document.getElementById('status').value
        })
    }).then(() => loadJobs());
}

function loadJobs() {
    fetch(`/jobs?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById('jobs');
            list.innerHTML = '';
            data.forEach(job => {
                const li = document.createElement('li');
                li.innerHTML = `${job.company} - ${job.role} (${job.status}) <button onclick="deleteJob(${job.id})">Delete</button>`;
                list.appendChild(li);
            });
        });
}

function deleteJob(id) {
    fetch(`/jobs/${id}`, { method: 'DELETE' })
        .then(() => loadJobs());
}
if
(window.location.pathname.includes('dashboard.html')) {
    loadJobs();
}