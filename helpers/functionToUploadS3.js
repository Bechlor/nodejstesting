import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export const uploadToS3 = async (buffer, s3Key) => {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key,
    Body: buffer,
    // ACL: 'public-read'
  };

  const command = new PutObjectCommand(uploadParams);
  await s3.send(command);

  const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
  return fileUrl;
};