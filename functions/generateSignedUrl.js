const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_USER_ACCESS_KEY,
    secretAccessKey: process.env.AWS_USER_SECRET_KEY,
    region: process.env.AWS_BUCKET_REGION
});

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { fileName, contentType } = JSON.parse(event.body);  // Extract the contentType
    console.log('FileName:', fileName);
    console.log('ContentType:', contentType);  // Log the received contentType

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${process.env.AWS_IMAGE_PATH}/${fileName}`,
        Expires: 60,  // The signed URL will be valid for 1 minute
        ContentType: contentType  // Use the received contentType
    };

    console.log('S3 Params:', params);

    try {
        const signedUrl = await s3.getSignedUrlPromise('putObject', params);
        console.log('Signed URL:', signedUrl);
        return { statusCode: 200, body: JSON.stringify({ signedUrl }) };
    } catch (error) {
        console.error('Error generating signed URL:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Error generating signed URL', details: error.message }) };
    }
};

