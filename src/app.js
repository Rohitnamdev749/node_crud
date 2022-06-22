// dotenv for security purpose it's import top of the file
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const app = express()
require('./db/config');
const auth = require('./middlewares/auth');
let port = process.env.PORT || 3000
const Student = require('./models/student');
// app.use(auth())
app.use(express.json());
app.use(cookieParser());

app.get("/", async (req, res) => {
    try {
        const data = await Student.find()
        res.send(data)
    } catch (err) {
        res.send("result not found")
    }
})


app.post("/", async (req, res) => {
    console.log("req", req.body)
    const password = req.body.password
    try {
        const data = new Student(req.body)
        // password hash middleware
        const token = await data.generateAuthToken()

        console.log("token check",token)
        let result = await data.save()
        console.log("data", result)
        res.status(200).send("data save successfully")
    } catch (err) {
        res.status(400).send("result not found")
    }
})


app.post('/login',async (req,res)=>{
    console.log("login req",req.body)

    try{
        const data = await Student.findOne({ email : req.body.email})

        const isMatch =  bcrypt.compare(req.body.password, data.password)

        const token = await data.generateAuthToken()

        res.cookie('jwt', token,{
            expires : new Date(Date.now() + 600000),
            httpOnly : true
        })

        if(isMatch){
            res.status(201).send("Login successfully...")
        }else{
            res.status(404).send("Invalid Username and Password")
        }
        console.log("token check",token)

    }catch(err){
        res.send(err)
    }
})

// auth is a router level middleware
app.get('/information',auth,(req,res)=>{
    console.log("information ",req.body);

    

    res.status(201).send(req.data)

})


app.get("/logout",auth, async (req,res)=>{
    try{

        console.log("req.data--->",req.data)
        // delete token from database

        req.data.tokens = req.data.tokens.filter((currentElem)=>{
            return currentElem.token !== req.token

        })

        // delete token from cookies
        res.clearCookie("jwt");
        await req.data.save()
        res.send('logout successfully')
    }catch(err){
        res.send(err)
    }
})








app.listen(port, () => {
    console.log("server run")
})