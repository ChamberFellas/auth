
require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const { default: mongoose } = require('mongoose');

const PORT = 8080;

// Mock database (temporary)
//              bob       bobsPassword
let users = [
    { username: "bob", password: "$2b$15$nShlDMY7GZmvTUnNXy4ya.7eDi447LPjEk7eBPiNq618urnT8ig5W", salt:"$2b$15$nShlDMY7GZmvTUnNXy4ya." },
];
//connect to DB

mongoose.connect("mongodb://localhost:27017/User_authentication")

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String
})

const userModel = mongoose.model("users",userSchema)




app.use( express.json() );

app.listen(
    PORT,
    () => console.log('its alive at : http://localhost:' + PORT)
)

//middle ware#######################################################################################################################################

function generateAccessToken(user){
    return accessToken = jwt.sign({user} , process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });//short for testing
}

function generateRefreshToken(user){
    return accessToken = jwt.sign({user} , process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
}

function AuthenticateToken(token,res){
    if(!token){
        res.status(418).send({
            error: 'you didnt send a token silly!'
        })
    }else{
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user) => { // i dont like the syntax but it works :(
            if(err){
                //the token is not valid
                res.status(401).send({
                    error: 'Invalid or expired token'
                }) 
            }else{
                return user
            }

        })
    } 
}




//endpoints##########################################################################################################################################


//token validation 
//this is also a good way to test that i ahve insomnia set up correctly and propelry understand how this works
app.post('/auth/internal/validate',async(req,res) => {
    const {token} = req.body;

    try{
        const user = await AuthenticateToken(token,res)
        
        res.status(200).send({
            message: 'you succesfully sent a valid token ',
            userID: user,
            ValidToken: true
        })
    } catch (error) {
        res.status(500).send({ error: 'Something went wrong with the validation' });
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
app.post('/auth/register',async (req,res) => { //I had to label this async to give the hash enough time to compute
    const {username} = req.body;
    const {password} = req.body;
    

    if(!username || !password){
        res.status(418).send({
            error: 'you didnt send all the data silly!'
        })
    }else{//need to check username doesnt exist in db already
        
        try {
            // Check if the user already exists in the database
            const existingUser = await userModel.findOne({ username });
    
            if (existingUser) {
                return res.status(409).send({ error: 'Username already taken. Choose another one!' });
            }else{
                const salt = await bcrypt.genSalt(15);  // we need the await as the hashing takes a while(to help protect against brute force) 2^N(15 at moment)
                                                        // 15 was said to be a good level of work on this video:   https://www.youtube.com/watch?v=qgpsIBLvrGY  but i may deecrease it as its running a bit TOO slow
                const hashedPassword = await bcrypt.hash(password, salt);  

                const newUser = new userModel({
                    username: username,
                    password: hashedPassword,
                    salt: salt
                });
                await newUser.save(); // Save the user to MongoDB
                res.status(201).send({
                    message: 'User successfully registered!',
                    username: username
                });
            }
            
        } catch (error) {
            res.status(500).send({ error: 'Something went wrong with hashing!' });
        }
    }
    
});


//loging in a user
app.post('/auth/login',async(req,res) => {
    const { username, password } = req.body;

    //find the entry in the database with the username, than get the slat and the password
    const user = await userModel.findOne({ username }); //im using === rather than == as == would treat '123' and 123 as equal which i dont want



    if (!user) {
        return res.status(401).send({ error: "account not recognised" });//
    }else{
        
        correctPassword=user.password;
        salt=user.salt;
        if (await bcrypt.compare(password, correctPassword)) {
            const accessToken = generateAccessToken(username);
            const refreshToken = generateRefreshToken(username);
    
            res.status(200).send({
                access_token: accessToken,
                refresh_token: refreshToken,
            }); 
        }else{
            return res.status(401).send({ error: "Invalid username or password" });
        }
        
    }
    
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
// Export app and startServer function
module.exports = { app, startServer };
