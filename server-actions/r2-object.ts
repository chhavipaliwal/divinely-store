import {S3Client, PutObjectCommand, DeleteObjectCommand} from '@aws-sdk/client-s3';


const S3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: `${process.env.CLOUDFLARE_ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.CLOUDFLARE_ACCESS_KEY_SECRET}`
    }
})

// export async function uploadObject(file: File) {
//     const command = new PutObjectCommand({
//         Bucket: 'r2',
//         Key: file.name,
//         Body: file
//     });
//     try {
//         const response = await S3.send(command);
//         console.log(response);
//         return response;
//     } catch (error) {
//         console.error(error);
//         return error;
//     }
// }

export async function uploadFileToS3(buffer: Buffer, filename: any, contentType: any) {
    const params = {
      Bucket: 'r2',
      Key: filename,
      Body: buffer,
      ContentType: contentType
    };
    const deleteParams = {
      Bucket: 'r2',
      Key: filename
    };
    await S3.send(new DeleteObjectCommand(deleteParams));
    const command = new PutObjectCommand(params);
    await S3.send(command);
    return filename;
  }