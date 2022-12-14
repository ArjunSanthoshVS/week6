var db = require('../config/connection')
var collection = require('../config/collections')
const { response } = require('express')
var objectId = require('mongodb').ObjectId

module.exports = {
    addProduct: (product, callback) => {
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data) => {
            callback(data.insertedId.toString());
        })
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray();
            resolve(products)
        })
    },
    deleteProduct: (prodId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: objectId(prodId) }).then((response) => {
                console.log(response);
                resolve(response)
            })
        })
    },
    getProductDetails: (prodId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectId(prodId) }).then((product) => {
                resolve(product)
            })
        })
    },
    updateProduct:(prodId,prodDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:objectId(prodId)},{
                $set:{
                    Name:prodDetails.Name,
                    Price:prodDetails.Price,
                    Processor:prodId.Processor,
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
}