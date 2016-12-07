// // Load the SDK and UUID
// var AWS = require('aws-sdk');
// var uuid = require('node-uuid');
//
// // Create an S3 client
// var s3 = new AWS.S3();
//
// // Create a bucket and upload something into it
// var bucketName = 'bucket-tamvan' + uuid.v4();
// var keyName = 'test.txt';
//
// s3.createBucket({Bucket: bucketName}, function() {
//   var params = {Bucket: bucketName, Key: keyName, Body: 'Hello World!'};
//   s3.putObject(params, function(err, data) {
//     if (err)
//       console.log(err)
//     else
//       console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
//   });
// });

//running with 'node uploader.js bucketName fileName'
//Access Key ID and Access Key ID Secret already taken by ~/.aws/credentials

'use strict'

const AWS = require('aws-sdk')
const fs = require('fs')

const selectedBucket = process.argv[2]
const selectedFile = process.argv[3]

fs.readFile(`./${selectedFile}`, function(err, data){
  if(err){
    console.log(err);
    return
  }

  var base64data = new Buffer(data, 'binary')

  var s3 = new AWS.S3()

  s3.listBuckets((err, dataBuckets) => {
    if (err) {
      console.log(err);
    }else{
      let checkBucketExist = dataBuckets.Buckets.map((bucket) => {
        return bucket.Name
      }).indexOf(selectedBucket)

      if(checkBucketExist === -1 ){//bucket no exist
        s3.createBucket({
          Bucket: `${selectedBucket}`
        }, function(err, data) {
          if (err) {
            if(err.code === 'BucketAlreadyExists'){
              console.log(`Bucket ${selectedBucket} already exist`);
            } else {
              console.log("Error", err);
            }
          } else {
            console.log("Success created new bucket", data.Location);

            s3.putObject({
              Bucket: `${selectedBucket}`,
              Key: `${selectedFile}`,
              Body: base64data,
              ACL: 'public-read'
            }, function(response){
              if(response === null){
                console.log(`Success uploaded file ${selectedFile} to new ${selectedBucket}`);
              }else{
                console.log(response);
              }
            })
          }
        });
      } else {
        s3.putObject({
          Bucket: `${selectedBucket}`,
          Key: `${selectedFile}`,
          Body: base64data,
          ACL: 'public-read'
        }, function(response){
          if(response === null){
            console.log(`Success uploaded file ${selectedFile} to existed ${selectedBucket}`);
          }else{
            console.log(response);
          }
        })
      }
    }
  })
})
