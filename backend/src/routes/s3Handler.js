const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const getUploadUrl = async (filename, contentType) => {
    try {
        const key = `devTinder/profilePhotos/${filename.filename}-${Date.now()}`;
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            ContentType: contentType
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return { url, key };

    } catch (err) {
        console.error("Error Generating Upload Url:", err);
        throw err;
    }
};

const getDownloadUrl = async (key) => {
    try {
        const url = process.env.CLOUDFRONT_DOMAIN + key;
        return url;
    } catch (err) {
        console.error("Error Generating Download Url:", err);
        throw err;
    }
};

module.exports = {
    getUploadUrl,
    getDownloadUrl
};
