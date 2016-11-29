'use strict'

const AWS = require('aws-sdk')
const fs = require('fs')

AWS.config.update({accessKeyId: 'MyAccesKeyId', secretAccessKey: 'MySecretAccessKey'})

fs.readFile('./upload.txt', function(err, data) {
    if (err) {
        console.log(`Error : ${err}`)
        return
    } else {
        let base64data = new Buffer(data, 'binary')
        let s3 = new AWS.S3()
        s3.putObject({
            Bucket: 'ahyana-bucket',
            Key: 'success-upload-try2.txt',
            Body: base64data,
            ACL: 'public-read'
        }, function(response) {
            console.log('upload success')
            console.log(response)
        })
    }
})
