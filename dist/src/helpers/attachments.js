"use strict";

var _constants = require("../helpers/constants");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fs = require('fs');

var aws = require('aws-sdk');
var multer = require('multer');
var s3 = new aws.S3();
/**
*  Upload user image to s3
*/

const storageLocal = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, _path2.default.resolve(__dirname, '../../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + "" + _path2.default.extname(file.originalname));
    }
});

const upload = multer({ storage: storageLocal });

module.exports = {
    upload: upload,
    uploadBase64Image: (base64String, bucketName) => {
        return new Promise(async (resolve, reject) => {
            const buf = Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            let key = Date.now() + ".jpg";
            const params = {
                Key: key,
                Body: buf,
                Bucket: bucketName,
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg',
                ServerSideEncryption: 'aws:kms',
                SSEKMSKeyId: _constants.S3_BUCKET_KMS_ARN
            };
            s3.putObject(params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(key);
                }
            });
        });
    },
    /**
    *  delete document and image from s3
    */
    deleteDocument: (storageKey, bucketName) => {
        console.log(`Name --> ${storageKey} = Bucket --> ${bucketName}`);
        return new Promise(async (resolve, reject) => {
            s3.deleteObject({
                Bucket: bucketName,
                Key: storageKey
            }, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
};