

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
    
    const ValidToken = '1234';// this is a tempoary string showing a valid token so i can check everything works before linking it to the databas/ implementing jwt

    if(!testToken){
        res.status(418).send({
            error: 'you didnt send a token silly!'
        })
    }else if (testToken == ValidToken){
        res.status(200).send({
            token: 'you succesfully sent the valid token : '+testToken
        })
    }else{
        res.status(401).send({
            error: 'Invalid or expired token'
        }) 
    }

    
});

//token refreshing 
app.get('/auth/internal/refresh',(req,res) => {
    const {testToken} = req.body;
    
    
    const newToken = 'ABcD';// this is a tempoary string showing a example new token 
    const ValidToken = '1234';// this is a tempoary string showing a valid token so i can check everything works before linking it to the databas/ implementing jwt


    if(!testToken){
        res.status(418).send({
            error: 'you didnt send a token silly!'
        })
    }else if (testToken == ValidToken){
        res.status(200).send({
            oldtoken: 'you succesfully sent the token : '+ testToken, 
            newtoken: 'Your new token is : '+ newToken,
            newTokenItem : newToken
        })
    }else{
        res.status(401).send({
            error: 'Invalid or expired token'
        }) 
    }

    
});
