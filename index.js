// server creation step

// import express
const express = require('express')

// import data service
const dataService = require('./Services/data_service')

// jsonwebtoken import
const jwt = require('jsonwebtoken')

// import cors - intergrating front end and back end

const cors = require('cors')


// create server app using express
const app = express()

app.use(cors({
    origin: 'http://localhost:4200'
}))

// to parse json data
app.use(express.json())

// *******************************************************************************
// resolving API call
// GET - to read data
app.get('/', (req, res) => {
    res.send("GET REQUEST")
})

// POST - to create data
app.post('/', (req, res) => {
    res.send("POST REQUEST")
})

// PUT - to update/modify data
app.put('/', (req, res) => {
    res.send("PUT REQUEST")
})

// PATCH - to partially update data
app.patch('/', (req, res) => {
    res.send("PATCH REQUEST")
})

// DELETE - to delete data
app.delete('/', (req, res) => {
        res.send("DELETE REQUEST")
    })
    // *******************************************************************************


// Creating Bank Server

// jwtMiddleware to verify token
const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.headers["x-access-token"]
        const data = jwt.verify(token, 'alpha666')
        req.currentacno = data.currentacno
        next()
    } catch {
        res.status(401).json({
            status: false,
            message: "Please Log in..!!"
        })
    }
}

// register api
app.post('/register', (req, res) => {

    dataService.register(req.body.uname, req.body.acno, req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result)
        })


})

// login api
app.post('/login', (req, res) => {

    dataService.login(req.body.acno, req.body.pswd)
        .then(result => {
            res.status(result.statusCode).json(result)

        })


})

// deposit api router specific middleware
app.post('/deposit', jwtMiddleware, (req, res) => {

    dataService.deposit(req, req.body.acno, req.body.pswd, req.body.amt)
        .then(result => {
            res.status(result.statusCode).json(result)

        })


})


// withdraw api router specific middleware
app.post('/withdraw', jwtMiddleware, (req, res) => {

    dataService.withdraw(req, req.body.acno, req.body.pswd, req.body.amt)
        .then(result => {
            res.status(result.statusCode).json(result)

        })


})

// transaction api router specific middleware

app.post('/transaction', jwtMiddleware, (req, res) => {

    dataService.transaction(req, req.body.acno)
        .then(result => {
            res.status(result.statusCode).json(result)

        })



})

// deleteACC api router specific middleware


app.delete('/onDelete/:acno', jwtMiddleware, (req, res) => {
    dataService.deleteAcc(req.params.acno)
        .then(result => {
            res.status(result.statusCode).json(result)

        })
})



// set port number
app.listen(3000, () => {
    console.log("server started at 3000");
})