
const express = require('express');
const app = express();

// i believe i will also need:       const jwt = require('jsonwebtoken'); 

const PORT = 8080;


app.use( express.json() );

app.listen(
    PORT,
    () => console.log('its alive at : http://localhost:' + PORT)
)


//token validation 
//this is also a good way to test that i ahve insomnia set up correctly and propelry understand how this works
app.post('/auth/internal/validate',(req,res) => {
    const {testToken} = req.body;
    
    if(!testToken){
        res.status(418).send({
            error: 'you didnt send a token silly!'
        })
    }

    res.status(200).send({
        token: 'you succesfully sent the token : '+testToken
    })
});

//token 
app.get('/auth/internal/refresh',(req,res) => {
    const {testToken} = req.body;
    const newToken = 5678;

    if(!testToken){
        res.status(418).send({
            error: 'you didnt send a token silly!'
        })
    }

    res.status(200).send({
        oldtoken: 'you succesfully sent the token : '+ testToken, 
        newtoken: 'Your new token is : '+ newToken
    })
});
