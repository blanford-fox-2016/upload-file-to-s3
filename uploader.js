var AWS = require('aws-sdk')
var fs = require('fs')

AWS.config.update({
    accessKeyId: 'AKIAJVPANLWXMMBRAR7A',
    secretAccessKey: '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'
})

fs.readFile('./upload.txt', function (err, data) {
    if (err){
        console.log(err)
        return
    }



    var base64data = new Buffer(data, 'binary')
    var s3 = new AWS.S3()


    var bucketsTemp = []
    var newBucket = 'testingCreateNewBucket'
    var flag = 0
    s3.listBuckets(function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            // console.log(data.Buckets);
            bucketsTemp = data.Buckets


            for (var i = 0; i < bucketsTemp.length; i++) {
                // console.log(bucketsTemp[i].Name)
                if (bucketsTemp[i].Name === newBucket) {
                    flag = 1
                }
            }

            if (flag === 0) {
                s3.createBucket({Bucket: newBucket}, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else {
                        s3.putObject({
                            Bucket: newBucket,
                            Key: 'berhasil.txt',
                            Body: base64data,
                            ACL: 'public-read'
                        }, function (response) {
                            console.log('uploaded')
                        })
                    }
                });
            }
        }           // successful response
    });
})