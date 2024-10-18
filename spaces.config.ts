import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
dotenv.config(); // Đọc file .env

// Cấu hình kết nối với DigitalOcean Spaces
export const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint('sgp1.digitaloceanspaces.com'), // Thay 'nyc3' bằng vùng bạn chọn
  accessKeyId: process.env.DO_SPACE_ACCESS_KEY, // Lấy từ DigitalOcean
  secretAccessKey: process.env.DO_SPACE_SECRET_KEY, // Lấy từ DigitalOcean
});
