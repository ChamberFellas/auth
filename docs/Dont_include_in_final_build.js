// client.js
import axios from 'axios';
import crypto from 'crypto';
// Make requests to your endpoints like so
const host= '172.26.107.70:8080';

// Example: Call the /auth/register endpoint
async function registerUser(username,password) {

    const hashedPassword = crypto.createHash('sha256').update((password+username)).digest('hex')
    const userData = {
        username: username,
        password: hashedPassword
    };

    try {
        const response = await axios.post('http://'+host+'/auth/register', userData);
        //console.log(response.data);
        return [response.data.message,response.data.username];
    } catch (error) {
        return [('Error updating account:', error.response ? error.response.data : error.message),0];
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
        const response = await axios.post('http://'+host+'/auth/login', userData);
        return ['success',response.data.access_token];
    } catch (error) {
        return [('Error updating account:', error.response ? error.response.data : error.message),0];
    }
}

// Example: Call the /auth/internal/validate endpoint to validate a token
async function validateToken(token) {
    try {
        const response = await axios.post('http://'+host+'/auth/internal/validate', { token });
        return [response.data.message,response.data.userID,response.data.ValidID];
        //console.log("Token Validation Response:", response.data);
    } catch (error) {
        return [('Error updating account:', error.response ? error.response.data : error.message),0,0];
    }
}

async function deleteAccount(token,username,password) {
    const hashedPassword = crypto.createHash('sha256').update((password+username)).digest('hex')
    try {
        const response = await axios.post('http://'+host+'/auth/delete', { token, hashedPassword });
        return [response.data.message,response.data.userID_DELETED];
    } catch (error) {
        return [('Error updating account:', error.response ? error.response.data : error.message),0];
    }
}


async function updateAccount(token,newerpassword,username,olderpassword) {
    const oldPassword = crypto.createHash('sha256').update((olderpassword+username)).digest('hex')
    const newPassword = crypto.createHash('sha256').update((newerpassword+username)).digest('hex')
    try {
        const response = await axios.post('http://'+host+'/auth/update', { token, oldPassword, newPassword });
        return [response.data.message,response.data.userID_UPDATED];
    } catch (error) {
        return [('Error updating account:', error.response ? error.response.data : error.message),0];
    }
}



// Run a test
const outputTESTregister = await registerUser("test", "password");
console.log(outputTESTregister); // no need to await console.log

const outputTESTlogin = await loginUser("test","password");
console.log(outputTESTlogin);

const outputTESTvalidate = await validateToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidGVzdCIsImlhdCI6MTc0MjMxODA1MiwiZXhwIjoxNzQyMzE4NjUyfQ.wy8_rTTv0RDju7ARAW0t2no3aurdTFEmQmhfWAgyBsY');
console.log(outputTESTvalidate);

const outputTESTdelete = await deleteAccount('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidGVzdCIsImlhdCI6MTc0MjMyMDU3NCwiZXhwIjoxNzQyMzIxMTc0fQ.CiK37TJ-qo2lU5IkrAcszbyEXw7cM-rkpITMjR9iPaQ','test','password');
console.log(outputTESTdelete);

const outputTESTupdate = await updateAccount('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidGVzdCIsImlhdCI6MTc0MjMxOTA5OCwiZXhwIjoxNzQyMzE5Njk4fQ.LxokwlSg_MCLE_Utrz6k-h8YPoMwtqFyYNPcK9oU6Zs','secondPassword','test','password');         
console.log(outputTESTupdate);
