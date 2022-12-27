const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const awsUpload = require('../utils/aws');

const uploadFile = catchAsync(async (req, res) => {
    const stream = fs.createWriteStream(`./tmp/${req.params.fileName}`);
    stream.on('open', () => {
        req.pipe(stream);
    });

    stream.on('close', async () => {
        console.log('File uploaded Locally');
        const name = new Date().getTime().toString();
        console.log(name);
        const extension = req.params.fileName.split('.')[1];
        fs.renameSync(`./tmp/${req.params.fileName}`, `./tmp/${name}.${extension}`);
        const resp = await awsUpload.uploadFile(`${name}.${extension}`, 'blockhole-test');
        console.log('File uploaded to AWS');
        stream.end();
        fs.unlinkSync(`./tmp/${name}.${extension}`);
        console.log('File deleted from local');
        res.status(200).json({
            status: true,
            message: 'File uploaded',
            url: resp,
        });
    });

    stream.on('error', (err) => {
        console.log(err);
        res.status(500).json({
            status: false,
            message: err.message,
        });
    });
});

const deleteFile = catchAsync(async (req, res) => {
    const { fileName } = req.params;
    const resp = await awsUpload.deleteFile(fileName, 'blockhole-test');
    res.status(200).json({
        status: true,
        message: 'File deleted',
        resp,
    });
});

module.exports = { uploadFile, deleteFile };
