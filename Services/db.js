// database connection

// install mongoose

const mongoose = require('mongoose')


// connection string to connect db with server

mongoose.connect('mongodb://localhost:27017/bankServer', {
    useNewUrlParser: true
})

// create a model inorder to manipulate things between server and db

const User = mongoose.model('User', {
    acno: Number,
    uname: String,
    password: Number,
    balance: Number,
    transaction: []
})


// export model
module.exports = {
    User
}