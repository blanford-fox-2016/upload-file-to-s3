require('dotenv').config()
const AWS = require('aws-sdk')
const fs = require('fs')

AWS.config.update({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY
})

fs.readFile('./upload.txt', function(err, data){
  if(err){
    console.log(err);
    return
  }

  var base64data = new Buffer(data, 'binary')

  var s3 = new AWS.S3()

  s3.putObject({
    Bucket: 'ken-learn-s3-bucket',
    Key: 'berhasil.txt',
    Body: base64data,
    ACL: 'public-read'
  }, function(response){
    console.log(`uploaded`);
    console.log(response);
  })
})
