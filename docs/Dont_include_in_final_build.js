// client.js
const axios = require('axios');
const bcrypt = require("bcryptjs");
const crypto = require('crypto');

// Make requests to your endpoints like so

// Example: Call the /auth/register endpoint
async function registerUser(username,password) {

    const hashedPassword = crypto.createHash('sha256').update((password+username)).digest('hex')
    const userData = {
        username: username,
        password: hashedPassword
    };

    try {
        const response = await axios.post('http://localhost:8080/auth/register', userData);
        console.log(response.data);
    } catch (error) {
        console.error('Error registering user:', error.response ? error.response.data : error.message);
    }
}

// Example: Call the /auth/login endpoint
async function loginUser(username,password){
    const hashedPassword = crypto.createHash('sha256').update((password+username)).digest('hex')
    const userData = {
        username: username,
        password: hashedPassword
    };

    try {
        const response = await axios.post('http://localhost:8080/auth/login', userData);
        console.log(response.data);
    } catch (error) {
        console.error('Error logging in:2', error.response ? error.response.data : error.message);
    }
}

// Example: Call the /auth/internal/validate endpoint to validate a token
async function validateToken(token) {
    try {
        const response = await axios.post('http://localhost:8080/auth/internal/validate', { token });
        console.log("Token Validation Response:", response.data);
    } catch (error) {
        console.error('Error validating token:', error.response ? error.response.data : error.message);
    }
}



// Run a test
//registerUser("finn","password");//create boolean for success
//loginUser("finn","password");
validateToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZmlubiIsImlhdCI6MTc0MjMxMDkyOCwiZXhwIjoxNzQyMzExNTI4fQ.7DhMjQxlyDZKabxmnrTiLPOYf6ZccIXxKIcVvuK9ieM');
