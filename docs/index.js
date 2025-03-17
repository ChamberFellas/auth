
require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

const PORT = 8080;

// Mock database (temporary)
let users = [
    { username: "bob", password: "bobsPasswordSpIcE", spice:"SpIcE" },
];


app.use( express.json() );

app.listen(
    PORT,
    () => console.log('its alive at : http://localhost:' + PORT)
)

//middle ware#######################################################################################################################################

function generateAccessToken(user){
    return accessToken = jwt.sign({user} , process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });//short for testing
}

function generateRefreshToken(user){
    return accessToken = jwt.sign({user} , process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
}






//endpoints##########################################################################################################################################


//token validation 
//this is also a good way to test that i ahve insomnia set up correctly and propelry understand how this works
app.post('/auth/internal/validate',(req,res) => {
    const {testToken} = req.body;
    
    const ValidToken = '1234';// this is a tempoary string showing a valid token so i can check everything works before linking it to the databas/ implementing jwt
    const user="bob";//this will be derived from the token

    if(!testToken){
        res.status(418).send({
            error: 'you didnt send a token silly!'
        })
    }else if (testToken == ValidToken){
        res.status(200).send({
            message: 'you succesfully sent a valid token ',
            userID: user,
            ValidToken: true
        })
    }else{
        res.status(401).send({
            error: 'Invalid or expired token'
        }) 
    }

    
});

//token refreshing 
app.post('/auth/internal/refresh',(req,res) => {
    const {testToken} = req.body;
    
    
    const newToken = 'ABcD';// this is a tempoary string showing a example new token 
    const validRefreshToken = '1234';// this is a tempoary string showing a valid token so i can check everything works before linking it to the databas/ implementing jwt

    if (!refresh_token) {
        return res.status(400).send({ error: "No refresh token provided" });
    }

    if (refresh_token === validRefreshToken) {
        return res.status(200).send({
            access_token: "newAccessToken123",
            refresh_token: "newRefreshToken456",
        });
    }

    res.status(401).send({ error: "Invalid or expired refresh token" })

    
});

//registering a new user
app.post('/auth/register',(req,res) => {
    const {username} = req.body;
    const {password} = req.body;
    
    
    /* 
    "username": "bob"
    "password" : "bobsPassword"
    */

    if(!username || !password){
        res.status(418).send({
            error: 'you didnt send all the data silly!'
        })
    }else {
        res.status(200).send({
            username: 'you succesfully sent the username : '+username,
            password: password,
            result: 'succesfully added to the totally real database'
        })
    }
    /*else{

        res.status(401).send({
            error: 'Invalid details'
        }) 
    }*/
    // the above will neeed to be included but as i sont currently have anything to validate if a password and username is acceptable i had to comment it out for now

});


//loging in a user
app.post('/auth/login',(req,res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === (password+ u.spice)); //im using === rather than == as == would treat '123' and 123 as equal which i dont want
    if (!user) {
        return res.status(401).send({ error: "Invalid username or password" });
    }

    const accessToken = generateAccessToken(username);
    const refreshToken = generateRefreshToken(username);

    res.status(200).send({
        access_token: accessToken,
        refresh_token: refreshToken,
    });
    
});

app.post('/auth/delete',(req,res) => {
    const {testToken} = req.body;
    
    const ValidToken = '1234';// this is a tempoary string showing a valid token so i can check everything works before linking it to the databas/ implementing jwt
    const user="bob";//this will be derived from the token

    if(!testToken){
        res.status(418).send({
            error: 'you didnt send a token silly!'
        })
    }else if (testToken == ValidToken){
        res.status(200).send({
            message: 'you succesfully deleted the account associated with that token ',
            userID: user
        })
    }else{
        res.status(401).send({
            error: 'Invalid or expired token'
        }) 
    }

    
});

