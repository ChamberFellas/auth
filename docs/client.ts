// client.ts

import axios from 'axios';
import crypto from 'crypto';

// --------------------
// Types
// --------------------

type RegisterResponse = [string, string | 0];
type LoginResponse = [string, string | 0];
type ValidateResponse = [string, number | 0, number | 0];
type DeleteResponse = [string, number | 0];
type UpdateResponse = [string, number | 0];

// --------------------
// Config
// --------------------

const host: string = '172.26.107.70:8080';

// --------------------
// Helpers
// --------------------

function hashPassword(username: string, password: string): string {
    return crypto.createHash('sha256').update(password + username).digest('hex');
}

// --------------------
// API Calls
// --------------------

export async function registerUser(username: string, password: string): Promise<RegisterResponse> {
    const hashedPassword = hashPassword(username, password);
    const userData = { username, password: hashedPassword };

    try {
        const response = await axios.post(`http://${host}/auth/register`, userData);
        return [response.data.message, response.data.username];
    } catch (error: any) {
        return [`Error registering account: ${error.response ? error.response.data : error.message}`, 0];
    }
}

export async function loginUser(username: string, password: string): Promise<LoginResponse> {
    const hashedPassword = hashPassword(username, password);
    const userData = { username, password: hashedPassword };

    try {
        const response = await axios.post(`http://${host}/auth/login`, userData);
        return ['success', response.data.access_token];
    } catch (error: any) {
        return [`Error logging in: ${error.response ? error.response.data : error.message}`, 0];
    }
}

export async function validateToken(token: string): Promise<ValidateResponse> {
    try {
        const response = await axios.post(`http://${host}/auth/internal/validate`, { token });
        return [response.data.message, response.data.userID, response.data.ValidID];
    } catch (error: any) {
        return [`Error validating token: ${error.response ? error.response.data : error.message}`, 0, 0];
    }
}

export async function deleteAccount(token: string, username: string, password: string): Promise<DeleteResponse> {
    const hashedPassword = hashPassword(username, password);

    try {
        const response = await axios.post(`http://${host}/auth/delete`, { token, hashedPassword });
        return [response.data.message, response.data.userID_DELETED];
    } catch (error: any) {
        return [`Error deleting account: ${error.response ? error.response.data : error.message}`, 0];
    }
}

export async function updateAccount(token: string, newerPassword: string, username: string, olderPassword: string): Promise<UpdateResponse> {
    const oldPassword = hashPassword(username, olderPassword);
    const newPassword = hashPassword(username, newerPassword);

    try {
        const response = await axios.post(`http://${host}/auth/update`, { token, oldPassword, newPassword });
        return [response.data.message, response.data.userID_UPDATED];
    } catch (error: any) {
        return [`Error updating account: ${error.response ? error.response.data : error.message}`, 0];
    }
}

// --------------------
// Tests
// --------------------

const outputTESTregister = await registerUser("test", "password");
console.log(outputTESTregister);

const outputTESTlogin = await loginUser("test", "password");
console.log(outputTESTlogin);

const outputTESTvalidate = await validateToken('your_token_here');
console.log(outputTESTvalidate);

const outputTESTdelete = await deleteAccount('your_token_here', 'test', 'password');
console.log(outputTESTdelete);

const outputTESTupdate = await updateAccount('your_token_here', 'secondPassword', 'test', 'password');
console.log(outputTESTupdate);