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
    s3.putObject({
        Bucket: 'dharmadi93',
        Key: 'berhasil.txt',
        Body: base64data,
        ACL: 'public-read'
    }, function (response) {
        console.log('uplaoded')
    })
})