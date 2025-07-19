import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';

// Uncomment these lines and install aws-sdk when ready to use S3
// import * as AWS from 'aws-sdk';
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });
// const S3_BUCKET = process.env.AWS_S3_BUCKET;

// Uncomment these lines and install firebase-admin when ready to use Firebase Storage
// import * as admin from 'firebase-admin';
// import { v4 as uuidv4 } from 'uuid';
// admin.initializeApp({
//   credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON)),
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
// });
// const firebaseBucket = admin.storage().bucket();

export interface StorageResult {
  url: string;
  key: string;
}

@Injectable()
export class StorageService {
  private uploadDir = path.resolve(__dirname, '../../../../uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Save file locally and return its URL and key.
   * Later, you can swap this logic for S3/Cloudinary/Firebase/etc.
   */
  async uploadFile(file: Express.Multer.File): Promise<StorageResult> {
    // --- LOCAL STORAGE IMPLEMENTATION ---
    const filename = `${Date.now()}-${file.originalname}`;
    const dest = path.join(this.uploadDir, filename);
    fs.writeFileSync(dest, file.buffer);
    // For local, serve from /uploads
    const url = `/uploads/${filename}`;
    return { url, key: filename };

    // --- S3 IMPLEMENTATION (UNCOMMENT TO USE) ---
    // const s3Key = `${Date.now()}-${file.originalname}`;
    // const params = {
    //   Bucket: S3_BUCKET,
    //   Key: s3Key,
    //   Body: file.buffer,
    //   ContentType: file.mimetype,
    //   ACL: 'public-read',
    // };
    // await s3.upload(params).promise();
    // const url = `https://${S3_BUCKET}.s3.amazonaws.com/${s3Key}`;
    // return { url, key: s3Key };

    // --- FIREBASE STORAGE IMPLEMENTATION (UNCOMMENT TO USE) ---
    // const firebaseKey = `${Date.now()}-${file.originalname}`;
    // const fileRef = firebaseBucket.file(firebaseKey);
    // await fileRef.save(file.buffer, {
    //   metadata: {
    //     contentType: file.mimetype,
    //     metadata: { firebaseStorageDownloadTokens: uuidv4() },
    //   },
    //   public: true,
    // });
    // const url = `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(firebaseKey)}?alt=media`;
    // return { url, key: firebaseKey };
  }

  /**
   * Delete a file by key (filename).
   * Later, you can swap this for S3/Cloudinary/Firebase delete logic.
   */
  async deleteFile(key: string): Promise<void> {
    // --- LOCAL DELETE ---
    const filePath = path.join(this.uploadDir, key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // --- S3 DELETE (UNCOMMENT TO USE) ---
    // const params = {
    //   Bucket: S3_BUCKET,
    //   Key: key,
    // };
    // await s3.deleteObject(params).promise();

    // --- FIREBASE STORAGE DELETE (UNCOMMENT TO USE) ---
    // const fileRef = firebaseBucket.file(key);
    // await fileRef.delete();
  }
} 