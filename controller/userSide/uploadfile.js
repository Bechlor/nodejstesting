import { uploadToS3 } from "../../helpers/functionToUploadS3.js"
import path from "path";
import { S3Client, ListObjectsV2Command,DeleteObjectCommand, GetObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadFile = async (req, res, next) => {
  const { quote_id, fileType } = req.body;

  if (!req.file) {
    req.message = "No file provided";
    req.statusCode = 400;
    return next();
  }

  const ext = path.extname(req.file.originalname).toLowerCase();
  const s3Key = `quotes_data/${quote_id}/${fileType}${ext}`;   //quotes_data/3/front_Image.png
  const s3Url = await uploadToS3(req.file.buffer, s3Key);
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,  // Your S3 bucket name
    Key: s3Key,  // The S3 key for the uploaded file
  });
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    req.data = { s3Url,signedUrl };
    req.message = "Upload successful";
    req.statusCode = 200;
    req.status = 1;
    next();
}; 

export const getuploadedImage = async (req, res, next) => {
  const { quote_id } = req.query;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: `quotes_data/${quote_id}/`, // Only list files inside this folder
  };

  const data = await s3.send(new ListObjectsV2Command(params));

  console.log(data,"data")

  if (!data.Contents || data.Contents.length === 0) {
    req.message = "No files found for this quote_id in S3";
    req.statusCode = 404;
    return next();
  }

  const files = data.Contents.map(file => ({
    fileType: file.Key.replace(`quotes_data/${quote_id}/`, ""),
    url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`,
    size: file.Size,
    lastModified: file.LastModified
  }));

  req.data = files;
  req.message = "success";
  req.statusCode = 200;
  req.status = 1;
  return next();
};

export const deleteFile = async (req, res, next) => {
  const { quote_id, fileType } = req.query;

    if (!quote_id || !fileType) {
      req.message = "quote_id and fileType are required";
      req.statusCode = 400;
      return next();
    }

    // Step 1: Find the exact file with that prefix (e.g., quote_id/frontImage.jpg)
    const listParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: `quotes_data/${quote_id}/${fileType}`,
    };

    const listResult = await s3.send(new ListObjectsV2Command(listParams));

    if (!listResult.Contents || listResult.Contents.length === 0) {
      req.message = "File not found in S3";
      req.statusCode = 404;
      return next();
    }

    const fileKey = listResult.Contents[0].Key;

    // Step 2: Delete the file
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));

    req.data = { deletedFile: fileKey };
    req.message = "File deleted successfully from S3";
    req.statusCode = 200;
    req.status = 1;
    return next();
};
