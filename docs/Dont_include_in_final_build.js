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
        console.error('Error logging in:', error.response ? error.response.data : error.message);
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

async function deleteAccount(token,username,password) {
    const hashedPassword = crypto.createHash('sha256').update((password+username)).digest('hex')
    try {
        const response = await axios.post('http://localhost:8080/auth/delete', { token, hashedPassword });
        console.log("account Deleting Response:", response.data);
    } catch (error) {
        console.error('Error deleting account:', error.response ? error.response.data : error.message);
    }
}


async function updateAccount(token,newerpassword,username,olderpassword) {
    const oldPassword = crypto.createHash('sha256').update((olderpassword+username)).digest('hex')
    const newPassword = crypto.createHash('sha256').update((newerpassword+username)).digest('hex')
    try {
        const response = await axios.post('http://localhost:8080/auth/update', { token, oldPassword, newPassword });
        console.log("account updating Response:", response.data);
    } catch (error) {
        console.error('Error updating account:', error.response ? error.response.data : error.message);
    }
}



// Run a test
//registerUser("test","password");//create boolean for success
//loginUser("test","password");
//validateToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidGVzdCIsImlhdCI6MTc0MjMxODA1MiwiZXhwIjoxNzQyMzE4NjUyfQ.wy8_rTTv0RDju7ARAW0t2no3aurdTFEmQmhfWAgyBsY');
//deleteAccount('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidGVzdCIsImlhdCI6MTc0MjMyMDU3NCwiZXhwIjoxNzQyMzIxMTc0fQ.CiK37TJ-qo2lU5IkrAcszbyEXw7cM-rkpITMjR9iPaQ','test','password');
//updateAccount('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidGVzdCIsImlhdCI6MTc0MjMxOTA5OCwiZXhwIjoxNzQyMzE5Njk4fQ.LxokwlSg_MCLE_Utrz6k-h8YPoMwtqFyYNPcK9oU6Zs','secondPassword','test','password');         
