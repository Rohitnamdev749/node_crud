const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/testing",{
    // useCreateIndex : true,
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(()=>{
    console.log("connection successfully")
}).catch((err)=>{
    console.log("connection failed",err)
})