const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const app = express();
const PORT = 8080;

const userSchema = new Schema({
    email : String,
    fullName : String,
    password : String
});

const User = mongoose.model("User", userSchema);

app.use(express.static("./public"));
app.use(express.urlencoded({extended : true}));

const signUpPage = fs.readFileSync(path.join(__dirname, "public", "signup.html"));
const logInPage = fs.readFileSync(path.join(__dirname, "public", "login.html"));


mongoose.connect("mongodb://127.0.0.1/user", () => {
    console.log("Connected...");
});

//mongodb+srv://BehshadMoradi:Wanted007@cluster0.eqhlv.mongodb.net/?retryWrites=true&w=majority

app.get("/", (req, res) => {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(signUpPage);

})
app.get("/signup", (req, res) => {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(signUpPage);

})
app.get("/login", (req, res) => {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(logInPage);
})

app.post("/signup", (req, res) => {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var email = req.body.email;

    var regextPassword = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    var password = req.body.password;

    if (email.match(regexEmail) && password.match(regextPassword) && req.body.password === req.body.confirmpassword 
    && req.body.fullname.length > 5){
        User.findOne({email : req.body.email}, (err, result) => {
            if (result){
                return res.end("Already account with this email...");
            }
            else
            {
                const user = new User({
                    email : req.body.email,
                    fullName : req.body.fullname,
                    password : crypto.createHash('md5').update(req.body.password).digest('hex')
                });
                user.save();
                
                return res.end("Welcome to our website...")
            }
        })
    }else {
        return res.end("Error");
    }
})


app.post("/login", (req, res) => {
    User.findOne({email : req.body.email}, (err, result) => {
        if (result)
        {
            if (crypto.createHash('md5').update(req.body.password).digest('hex') === result.password)
            {
                return res.end("Welcome back...");
            }
            else
            {
                return res.end("Your password is not correct...");
            }
        }else{
            return res.end("No user with this email...");
        }
    })
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
