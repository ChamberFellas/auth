// client.js
const axios = require('axios');

// Make requests to your endpoints like so

// Example: Call the /auth/register endpoint
async function registerUser() {
    const userData = {
        username: "DAVE",
        password: "DAVESsecurepassword"
    };

    try {
        const response = await axios.post('http://localhost:8080/auth/register', userData);
        console.log(response.data);
    } catch (error) {
        console.error('Error registering user:', error.response ? error.response.data : error.message);
    }
}

// Example: Call the /auth/login endpoint
async function loginUser() {
    const userData = {
        username: "DAVE",
        password: "DAVESsecurepassword"
    };

    try {
        const response = await axios.post('http://localhost:8080/auth/login', userData);
        console.log(response.data);
    } catch (error) {
        console.error('Error logging in:', error.response ? error.response.data : error.message);
    }
}

// Run a test
//registerUser();
//loginUser();
