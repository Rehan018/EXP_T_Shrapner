const AWS = require('aws-sdk')




const uploadToS3 = (data, filename)=>{

    const BUCKET_NAME = 'expensetrackingapp777';
    const IAM_USER_KEY = 'AKIAR67XEEQZ4JP6F57B';
    const IAM_USER_SECRET = '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';

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
       
    })

    
        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read'
        }
        return new Promise((resolve,reject)=>{

            s3bucket.upload(params, (err,s3response)=>{
                if(err){
                    console.log('Something went wrong',err);
                    reject(err)
                }
                else{
                    console.log('success', s3response);
                     resolve(s3response.Location);
                }
            });

        })
        
  



}

module.exports = {
    uploadToS3
}

