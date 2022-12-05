const AWS = require('aws-sdk');
// const {AWS_ACCESS_KEY,AWS_SECRET_KEY} = require("../config/config");
require("dotenv").config()

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
})

const uploadFile = (filename, bucketname, file,ContentType) => {
    
    return new Promise((resolve, reject) => {
        const params = {
            Key: filename,
            Bucket: bucketname,
            Body: file,
            ContentType: ContentType,  //'audio/mpeg',
            ACL: 'public-read'
        }

        s3.upload(params, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data.Location)
            }
        })
    })
}

module.exports = uploadFile;