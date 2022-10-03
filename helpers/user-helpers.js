var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt');
var objectId = require('mongodb').ObjectId;

module.exports = {
    doSignUp: (userData, admin) => {
        return new Promise(async (resolve, reject) => {
            if (userData.name == null || userData.name.trim() == "" || userData.password == null || userData.password.trim() == "") {
                resolve({ data: false, message: "Enter valid data" })
            } else {
                let emailChecking = await db.get().collection(collection.USER_COLLECTION).find({ email: userData.email }).toArray()
                if (emailChecking.length !== 0) {
                    console.log(emailChecking)
                    resolve({ data: false, message: "Email is already used" })
                } else {
                    userData.password = await bcrypt.hash(userData.password, 10);
                    db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((result) => {
                        resolve({ data: true });
                    })
                }
            }
        })
    },

    doLogin: (userData) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email });
            console.log(user)
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        response.user = user;
                        response.status = true;
                        resolve(response)
                    } else {
                        resolve({ status: false });
                    }
                })
            } else {
                resolve({ status: false })
            }
        })
    },
    getAllUsers: () => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).find().toArray();
            resolve(user)
        })
    },
    deleteUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).deleteOne({ _id: objectId(userId) }).then((response) => {
                console.log(response);
                resolve(response)
            })
        })
    },
    getUserDetails: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) }).then((response) => {
                resolve(response)
            })
        })
    },
    updateUser: (userId, userDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userId) }, { $set: { name: userDetails.name, email: userDetails.email, } }).then((response) => {
                resolve(response)
            })
        })
    }
}