// server Creation 
//import express
const express = require('express')

//import jsonwebtoken
const jwt = require('jsonwebtoken')

const dataService = require('./services/data.service')

//server application creat using express
const app = express()

//parse json data
app.use(express.json())


//application specific middleware
const appMiddleware = (req, res, next) => {
    console.log("application specific middleware");
    next()
}

//use middleware in app
app.use(appMiddleware)

//bank server

const jwtMiddleware = (req, res, next) => {
    //fetch token
 try {  token = req.headers['x-access-token']
    //verify token
    const date = jwt.verify(token, 'supersecretkey12345')
    console.log(date);
    next()
}
    catch{
        res.status(401).json({
            status:false,
            statusCode:401,
            message:'Please login'
        })
    }
}


//bank Server -- register API

app.post('/register', (req, res) => {
    //register solving 

    const result = dataService.register(req.body.username, req.body.acno, req.body.password)
    res.status(result.statusCode).json(result)
})
// bank server --login API
app.post('/login', (req, res) => {
    //login solving 

    const result = dataService.login(req.body.acno, req.body.pswd)
    res.status(result.statusCode).json(result)
})

// bank server --deposit API
app.post('/deposit',jwtMiddleware,(req,res) => {
    //deposit solving 
    const result = dataService.deposit(req.body.acno, req.body.password, req.body.amt)
    res.status(result.statusCode).json(result)
})

// bank server --withdraw API
app.post('/withdraw',jwtMiddleware, (req, res) => {
    //withdraw solving 

    const result = dataService.withdraw(req.body.acno, req.body.password, req.body.amt)
    res.status(result.statusCode).json(result)
})

// bank server --getTransaction API
app.post('/transaction',jwtMiddleware, (req, res) => {
    //getTransaction solving 

    const result = dataService.getTransaction(req.body.acno,)
    res.status(result.statusCode).json(result)
})


//user request resolving....

//POST REQUEST - to create data in server
app.post('/', (req, res) => {
    res.send("POST Request")
})

//GET REQUEST - to fetch data
app.get('/', (req, res) => {
    res.send("GET Request")
})

//PUT REQUEST - to modifiy entire data
app.put('/', (req, res) => {
    res.send("PUT Request")
})

//PATCH REQUEST - to modify partially
app.patch('/', (req, res) => {
    res.send("PATCH Request")
})

//DELETE REQUEST - to remove / delete data 
app.delete('/', (req, res) => {
    res.send("DELETE Request")
})

//set up the port number to the server application

app.listen(3000, () => {
    console.log("server started at 3000");
})