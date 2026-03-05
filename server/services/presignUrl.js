import crypto from "crypto";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "./s3client.js";
async function getProfilePicPresignedPutUrl(contentType, userPK) {
  const key = "avatars/" + userPK;
  const cmd = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  const signedUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 });
  return { signedUrl, key };
}

async function getProfilePicPresignedGetUrl(userPK) {
  const key = "avatars/" + userPK;
  const cmd = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  });
  const signedUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 });
  return signedUrl;
}

export { getProfilePicPresignedPutUrl, getProfilePicPresignedGetUrl };
