var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt');

module.exports = {
    adminSignUp: (adminData) => {
        return new Promise(async (resolve, reject) => {
            if (adminData.name == null || adminData.name.trim() == "" || adminData.password == null || adminData.password.trim() == "") {
                resolve({ data: false, message: "Enter valid data" })
            } else {
                let emailChecking = await db.get().collection(collection.ADMIN_COLLECTION).find({ email: adminData.email }).toArray()
                if (emailChecking.length !== 0) {
                    console.log(emailChecking)
                    resolve({ data: false, message: "Email is already used" })
                } else {
                    adminData.password = await bcrypt.hash(adminData.password, 10);
                    db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((result) => {
                        resolve({ data: true });
                    })
                }
            }
        })
    },

    adminLogin: (adminData) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: adminData.email });
            console.log(admin)
            if (admin) {
                bcrypt.compare(adminData.password, admin.password).then((status) => {
                    if (status) {
                        response.admin = admin;
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
    searchUser: (userData) => {
        return new Promise(async (resolve, reject) => {
            console.log(userData.search);
            let user = await db.get().collection(collection.USER_COLLECTION).find({ name: userData.search }).toArray()
            if (user) {
                resolve(user)
            } else {
                resolve({ data: false })
            }
        })
    }
}