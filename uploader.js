'use strict'

const AWS = require('aws-sdk')
const fs = require('fs')
const args = process.argv

AWS.config.update({accessKeyId: 'MyAccessKeyId', secretAccessKey: 'MySecretAccessKey'})

const s3 = new AWS.S3()

fs.readFile(args[3], function(err, data) {
    if (err) {
        console.log(`Error : ${err}`)
        return
    } else {
        let base64data = new Buffer(data, 'binary')
        s3.putObject({
            Bucket: args[2],
            Key: args[4],
            Body: base64data,
            ACL: 'public-read'
        }, function(response) {
            if (response.message == 'The specified bucket does not exist') {
              fs.readFile(args[3], function(err, data) {
                let base64data = new Buffer(data, 'binary')
                if (err) {
                  console.log(`Error : ${err}`);
                  return
                } else {
                  s3.createBucket({Bucket: args[2]}, function() {
                    s3.putObject({
                      Bucket: args[2],
                      Key: args[4],
                      Body: base64data,
                      ACL: 'public-read'
                    }, function(response) {
                      console.log(`Bucket not found ! Upload success by automatically creating new bucket named '${args[2]}'`);
                      console.log('response : ', response);
                    })
                  })
                }
              })
            } else {
              console.log(`Upload to bucket ${args[2]} success with filename '${args[4]}'`);
              console.log('response :', response);
            }
        })
    }
})
