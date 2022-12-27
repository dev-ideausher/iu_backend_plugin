const aws = require('@aws-sdk/client-s3');
const fs = require('fs');
const { AWS_ACCESS_KEY, AWS_SECRET_KEY } = require('../config/config');

const uploadFile = (filename, bucketname) => new Promise((resolve, reject) => {
    const client = new aws.S3Client({
        region: 'us-east-1',
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
    });

    const fileStream = fs.createReadStream(`tmp/${filename}`);
    const uploadParams = {
        Bucket: bucketname,
        Key: filename,
        Body: fileStream,
        ACL: 'public-read',
    };
    client.send(new aws.PutObjectCommand(uploadParams), (err, data) => {
        if (err) {
            reject(err);
        } else {
            console.log(data);
            resolve(`https://${bucketname}.s3.us-east-1.amazonaws.com/${filename}`);
        }
    });
});

const deleteFile = (filename, bucketname) => new Promise((resolve, reject) => {
    const client = new aws.S3Client({
        region: 'us-east-1',
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
    });

    const deleteParams = {
        Bucket: bucketname,
        Key: filename,
    };

    client.send(new aws.DeleteObjectCommand(deleteParams), (err, data) => {
        if (err) {
            reject(err);
        } else {
            console.log(data);
            resolve(data);
        }
    });
});

module.exports = { uploadFile, deleteFile };
