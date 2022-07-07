//import jsonwebtoken
const jwt = require('jsonwebtoken')

//import db.js
const db = require('./db')

//DATABASE
// db = {
//     1000: { "acno": 1000, "username": "aby", "password": 1000, "balance": 5000, transaction: [] },
//     1001: { "acno": 1001, "username": "bae", "password": 1001, "balance": 50000, transaction: [] },
//     1002: { "acno": 1002, "username": "saly", "password": 1002, "balance": 3000, transaction: [] }
// }

//register
const register = (username, acno, password) => {

    return db.User.findOne({
        acno
    }).then(user => {
        console.log(user);
        if (user) {
            return {
                status: false,
                message: "Allready register..please Log In..",
                statusCode: 401
            }

        }
        else {
            //inserting db
            const newUser = new db.User({
                acno,
                username,
                password,
                balance: 0,
                transaction: []
            })
            newUser.save()
            return {
                status: true,
                message: "Registered succesfully",
                statusCode: 200
            }
        }
    })
}

//login
const login = (acno, pswd) => {
    return db.User.findOne({
        acno,
        password: pswd
    }).then(user => {
        if (user) {
            currentUser = user.username
            currentAcno = acno
            //token generaction
            token = jwt.sign({
                //store account number inside token
                currentAcno: acno
            }, 'supersecretkey12345')

            return {
                status: true,
                message: "Login succesfully",
                statusCode: 200,
                currentUser,
                currentAcno,
                token
            }

        }
        else {
            return {
                status: false,
                message: "Invalid Account number or Password !!!",
                statusCode: 401
            }

        }
    })
}

//deposite
const deposit = (acno, password, amt) => {
    var amount = parseInt(amt)
    return db.User.findOne({
        acno,
        password
    }).then(user => {
        if (user) {
            user.balance += amount
            user.transaction.push({
                type: "CREDIT",
                amount: amount
            })
            user.save()
            return {
                status: true,
                message: amount + "Deposited successfully....New balance is" + user.balance,
                statusCode: 200
            }
        }
        else {
            return {
                status: false,
                message: "Invalid Account number or Password !!",
                statusCode: 401
            }
        }
    })
}



//withdraw
const withdraw = (acno, password, amt) => {
    var amount = parseInt(amt)
    return db.User.findOne({
        acno,
        password
    }).then(user => {
        if (user) {
            if (user.balance > amount) {
                user.balance -= amount
                user.transaction.push({
                    type: "DEBIT",
                    amount: amount
                })
                user.save()
                return {
                    status: true,
                    message: amount + " Debitted successfully....New balance is" + user.balance,
                    statusCode: 200
                }
            }
            else {
                return {
                    status: false,
                    message: "Insufficient Balance !!",
                    statusCode: 401
                }
            }

        }
        else {
            return {
                status: false,
                message: "Invalid Account number or Password !!",
                statusCode: 401
            }
        }
    })
}

//transation
const getTransaction = (acno) => {

    return db.User.findOne({
        acno
    }).then(user => {
        if (user) {
            return {
                status: true,
                statusCode: 200,
                transaction: user.transaction
            }
        } else {
            return {
                status: false,
                message: "User does not exist..",
                statusCode: 401
            }
        }
    })
}

//export

module.exports = {
    register, login, deposit, withdraw, getTransaction
}