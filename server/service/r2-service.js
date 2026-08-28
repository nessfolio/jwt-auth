const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3'); 
const crypto = require('crypto');  
const path = require('node:path');

const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ACCOUNT_ID,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
    }
});

class R2Service {
    async uploadImage(fileBuffer, originalName, mimetype) {
        const uniqueSuffix = crypto.randomBytes(8).toString('hex');
        const ext = path.extname(originalName);
        const fileName = `${uniqueSuffix}${ext}`;

        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileName,
            Body: fileBuffer,
            ContentType: mimetype,
        });

        await s3Client.send(command);

        return `${process.env.R2_PUBLIC_URL}/${fileName}`;
    }
}

module.exports = new R2Service();