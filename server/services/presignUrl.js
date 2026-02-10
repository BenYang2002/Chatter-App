import crypto from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "./s3client.js";
async function getPresignedUrl(contentType, userPK) {
  const extension =
    contentType === "image/jpeg"
      ? "jpg"
      : contentType === "image/png"
        ? "png"
        : "jpeg";
  const key = "avatars/" + userPK + "." + extension;
  const cmd = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  const signedUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 });
  return { signedUrl, key };
}

export default getPresignedUrl;
