const jwt = require('jsonwebtoken');
const Student = require('../models/student');



const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        const verifyUser = jwt.verify(token, "mynameisrohitnamdevheavydeveloper");
        const data = await Student.findOne({ _id: verifyUser._id });

        req.token = token;
        req.data = data;
        // res.status(201).send(data)
        next()
    } catch (err) {
        res.status(404).send(err)
    }
}

module.exports = auth;