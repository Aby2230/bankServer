//import jsonwebtoken
const jwt = require('jsonwebtoken')
//DATABASE
db = {
    1000: { "acno": 1000, "username": "aby", "password": 1000, "balance": 5000, transaction: [] },
    1001: { "acno": 1001, "username": "bae", "password": 1001, "balance": 50000, transaction: [] },
    1002: { "acno": 1002, "username": "saly", "password": 1002, "balance": 3000, transaction: [] }
}

//register

var register = (username, acno, password) => {
    if (acno in db) {
        return {
            status: false,
            message: "Allready register..please Log In..",
            statusCode: 401
        }
    }
    else {
        db[acno] =
        {
            acno,
            username,
            password,
            "balance": 0,
            transaction: []
        }
        console.log(db)
        return {
            status: true,
            message: "Registered succesfully",
            statusCode: 200
        }
    }

}

//login
const login = (acno, pswd) => {


    if (acno in db) {
        if (pswd == db[acno]["password"]) {
            currentUser = db[acno]["username"]
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
                message: "incorrect password",
                statusCode: 401
            }
        }
    }
    else {
        return {
            status: false,
            message: "User does not exist..",
            statusCode: 401
        }
    }
}

//deposite
const deposit = (acno, password, amt) => {

    var amount = parseInt(amt)
    if (acno in db) {
        if (password == db[acno]["password"]) {

            db[acno]["balance"] += amount
            db[acno].transaction.push(
                {
                    type: "CREDIT",
                    amount: amount
                }
            )
            return {
                status: true,
                message: amount + "Deposited successfully....New balance is" + db[acno]["balance"],
                statusCode: 200
            }
        }
        else {
            return {
                status: false,
                message: "incorrect password",
                statusCode: 401
            }
        }

    } else {
        return {
            status: false,
            message: "User does not exist..",
            statusCode: 401
        }
    }

}

//withdraw
const withdraw = (acno, password, amt) => {
    var amount = parseInt(amt)
    if (acno in db) {
        if (password == db[acno]["password"]) {

            if (db[acno]["balance"] > amount) {


                db[acno]["balance"] -= amount
                db[acno].transaction.push(
                    {
                        type: "DEBIT",
                        amount: amount
                    })
                return {
                    status: true,
                    message: amount + "Debitted successfully....New balance is" + db[acno]["balance"],
                    statusCode: 200
                }

            }
            else {
                return {
                    status: false,
                    message: "Insufficent Balance ",
                    statusCode: 422
                }
            }
        }
        else {
            return {
                status: false,
                message: "incorrect password",
                statusCode: 401
            }
        }

    }
    else {
        return {
            status: false,
            message: "User does not exist..",
            statusCode: 401
        }
    }

}
//transation
const getTransaction = (acno) => {
    if (acno in db) {
        return {
            status: true,
            statusCode: 200,
            transaction: db[acno].transaction
        }
    }
    else {
        return {
            status: false,
            message: "User does not exist..",
            statusCode: 401
        }
    }
}



//export

module.exports = {
    register, login, deposit, withdraw, getTransaction
}