// Dummy API URLs for users login and registration
const registerApiUrl = "http://127.0.0.1:8000/users/register/";  // Registration API URL
const loginApiUrl = "http://127.0.0.1:8000/users/login/";  // Login API URL
const userTokenKey = "userAuthToken"; 

// Handle user login
document.getElementById('login-form')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        // Send a POST request to the login API
        fetch(loginApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem(userTokenKey, data.token);

                // Redirect to the dashboard
                window.location.href = "/dashboard";
            } else {
                alert("Invalid credentials. Please try again.");
                location.reload();
            }
            
        })
        .catch(error => {
            console.error("Error during login:", error);
            alert("An error occurred while logging in.");
            location.reload();
        });
    } else {
        alert("Please provide both username and password.");
        location.reload();
    }
});

// Handle user registration
document.getElementById('register-form')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    if (username && email && password) {
        // Send a POST request to the register API
        fetch(registerApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                // Registration successful. Store the token and redirect to login
                alert("Registration successful. Please log in.");
                location.reload();
                window.location.href = "/login";
            } else {
                alert("An error occurred during registration.");
                location.reload();
            }
        })
        .catch(error => {
            console.error("Error during registration:", error);
            alert("An error occurred while registering.");
            location.reload();
        });
    } else {
        alert("Please fill out all fields.");
        location.reload();
    }
});

// Fetch users after login (on dashboard)
document.addEventListener("DOMContentLoaded", function() {

    const token = localStorage.getItem(userTokenKey);

    if (token) {
        
        fetch("http://127.0.0.1:8000/users/", {
            headers: {
                "Authorization": `Token ${token}`,
            }
        })
        .then(response => response.json())
        .then(data => {
            const users = data.users;
            const userList = document.getElementById("user-list");

            userList.innerHTML = "";

            users.forEach(user => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${user.username}</strong><br>Email: ${user.email}`;
                userList.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
        });
    } 

    // Handle logout
    document.getElementById('logout-btn')?.addEventListener('click', function() {
        localStorage.removeItem(userTokenKey);  // Remove token
        window.location.href = "/login";  // Redirect to login page
        
    });
});
