const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const studentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 03
    },
    email: {
        type: String,
        required: true,
        unique: [true, "This Email id already present"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        }
    },
    phone: {
        type: Number,
        min: 10,
        required: true,
        unique: true

    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})


// middleware for generating token 
studentSchema.methods.generateAuthToken = async function () {
    try {
        console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString() }, "mynameisrohitnamdevheavydeveloper")
        console.log(token)
        this.tokens = this.tokens.concat({token : token})
        await this.save()
        return token

    } catch (err) {
        console.log("error is", err)
    }
}
// middleware for passwors hash
// it's take two argument 1. event "save" , 2. function
studentSchema.pre("save", async function (next) {
    // this work when first time registeration do
    console.log("hashhh", this.password)
    this.password = await bcrypt.hash(this.password, 10)
    // console.log("hashhh1111",passHash) 
    // this work on both condition when user registeration and reset(modified) 
    // if (this.isModified("password")) {
    //     const passHash = await bcrypt.hash(this.password, 10)
    // }
    next()
})
const Student = new mongoose.model('Student', studentSchema)

module.exports = Student;