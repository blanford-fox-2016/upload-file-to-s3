'use strict'

const AWS = require('aws-sdk')
const fs = require('fs')
var bucketName = 'tevinsssss-bucket'
var accessKeyId = 'INSERT KEY HERE'
var secretAccessKey = 'INSERT ACCESS KEY HERE'

AWS.config.update({ accessKeyId: accessKeyId, secretAccessKey: secretAccessKey })

fs.readFile('./upload.txt', function(err, data) {
    if (err) {
        console.log(`Error : ${err}`)
        return
    } else {
        let base64data = new Buffer(data, 'binary')
        let s3 = new AWS.S3()

        s3.listBuckets(function(err, data) {
            if (err) {
                console.log(err)
            } else {
                // console.log(data)
                for (var i = 0; i < data.Buckets.length; i++) {
                    if (bucketName != data.Buckets[i].Name) {
                        var myBucket = {
                            Bucket: bucketName,
                            /* required */
                        };

                        s3.createBucket(myBucket, function(err, data) {
                            if (err) {
                                console.log(err)
                            } else {
                                s3.putObject({
                                    Bucket: bucketName,
                                    Key: 'success-upload.txt',
                                    Body: base64data,
                                    ACL: 'public-read'
                                }, function(response) {
                                    console.log('upload success')
                                })
                            }
                        })
                    }
                }
            }
        })
    }
})
