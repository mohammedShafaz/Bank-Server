// jsonwebtoken import
const jwt = require('jsonwebtoken')

// import db
const db = require('./db')

database = {
    1000: { acno: 1000, uname: "shafaz", password: 1000, balance: 5000, transaction: [] },
    1001: { acno: 1001, uname: "rachel", password: 1001, balance: 4000, transaction: [] },
    1002: { acno: 1002, uname: "milan", password: 1002, balance: 7000, transaction: [] },

}


// ********** register ****** index.js will give uname, acno, password*******

const register = (uname, acno, password) => {

    // asynchronous
    return db.User.findOne({ acno })
        .then(user => {
            if (user) {
                return {
                    statusCode: 401,
                    status: false,
                    message: "Account already exist..."
                }

            } else {
                const newUser = new db.User({
                    acno,
                    uname,
                    password,
                    balance: 0,
                    transaction: []
                })
                newUser.save()

                return {
                    statusCode: 200,
                    status: true,
                    message: "Successfully registered...Please log in..!"
                }
            }
        })




}

// *************log in***************

const login = (acno, pswd) => {

    return db.User.findOne({ acno, password: pswd })
        .then(user => {
            if (user) {
                currentUsr = user.uname
                currentacno = acno
                    // already exist in db
                const token = jwt.sign({
                    currentacno: acno
                }, 'alpha666')


                return {
                    statusCode: 200,
                    status: true,
                    message: " Log in successfull...!",
                    token: token,
                    currentacno,
                    currentUsr

                }
            } else {
                return {
                    statusCode: 401,
                    status: false,
                    message: "Incorrect account number or password...!"
                }
            }
        })


}

//************ deposit********************




const deposit = (req, acno, pswd, amt) => {

    var amount = parseInt(amt)
    return db.User.findOne({ acno, password: pswd })
        .then(user => {
            if (user) {

                user.balance += amount

                user.transaction.push({

                    type: "CREDIT",
                    Amount: amount


                })
                user.save()
                return {
                    statusCode: 200,
                    status: true,
                    message: amount + " successfully creditted ..,New balance is : " + user.balance
                }

            } else {
                return {
                    statusCode: 401,
                    status: false,
                    message: "Incorrect account number or password...!"
                }
            }

        })


}

//************withdraw***************

const withdraw = (req, acno, pswd, amt) => {

    var amount = parseInt(amt)

    return db.User.findOne({ acno, password: pswd })
        .then(user => {
            if (req.currentacno != acno) {

                return {
                    statusCode: 422,
                    status: false,
                    message: "operation denied"
                }
            }
            if (user) {
                if (user.balance > amount) {
                    user.balance -= amount

                    user.transaction.push({

                        type: "DEBIT",
                        Amount: amount


                    })
                    user.save()
                    return {
                        statusCode: 200,
                        status: true,
                        message: amount + " successfully debitted ..,New balance is : " + user.balance
                    }

                } else {
                    return {
                        statusCode: 401,
                        status: false,
                        message: "Insufficient Balance...!"
                    }
                }

                // console.log(database);




            } else {
                return {
                    statusCode: 401,
                    status: false,
                    message: "Incorrect account number or password...!"
                }
            }
        })


}

// function transaction
const transaction = (req, acno) => {

    return db.User.findOne({ acno })
        .then(user => {



            if (user) {
                return {
                    statusCode: 200,
                    status: true,
                    transaction: user.transaction
                }
            } else {
                return {

                    statusCode: 401,
                    status: false,
                    message: "User does not exist....!"

                }
            }
        })

}

const deleteAcc = (acno) => {
    return db.User.deleteOne({ acno })
        .then(user => {
            if (!user) {
                return {

                    statusCode: 401,
                    status: false,
                    message: "Operation Failed....!"

                }
            } else {
                return {
                    statusCode: 200,
                    status: true,
                    message: "Account Number " + acno + " deleted Successfully..."
                }
            }
        })
}

// export
module.exports = {
    register,
    login,
    deposit,
    withdraw,
    transaction,
    deleteAcc
}