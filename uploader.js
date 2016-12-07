require('dotenv').config()
const AWS = require('aws-sdk')
const fs = require('fs')

const selectedBucket = process.argv[2]
const selectedFile = process.argv[3]

AWS.config.update({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY
})



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
      // console.log(`Bucket Lists : `);
      // console.log(dataBuckets.Buckets);
      let checkBucketExist = dataBuckets.Buckets.map((bucket) => {
        return bucket.Name
      }).indexOf(selectedBucket)

      if(checkBucketExist === -1 ){//bucket no exist
        s3.createBucket({
          Bucket: `${selectedBucket}`
        }, function(err, data) {
          if (err) {
            if(err.code === 'BucketAlreadyExists'){
              console.log(`Try again, bucket is already existed`);
            }else{
              console.log("Error", err);
            }
          } else {
            console.log("Success created new bucket", data.Location);

            s3.putObject({
              Bucket: `${selectedBucket}`,
              Key: 'success.txt',
              Body: base64data,
              ACL: 'public-read'
            }, function(response){
              if(response === null){
                console.log(`success uploaded file ${selectedFile} to new ${selectedBucket}`);
              }else{
                console.log(response);
              }
            })
          }
        });
      }else{
        s3.putObject({
          Bucket: `${selectedBucket}`,
          Key: 'success.txt',
          Body: base64data,
          ACL: 'public-read'
        }, function(response){
          if(response === null){
            console.log(`success uploaded file ${selectedFile} to existed ${selectedBucket}`);
          }else{
            console.log(response);
          }
        })
      }
    }
  })





})
