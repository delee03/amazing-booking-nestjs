# Sử dụng Node.js 22.9.0 làm base image
FROM node:22.9.0

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json để cài đặt dependencies
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn dự án vào container
COPY . .

# Chạy Prisma Generate
RUN npx prisma generate

# Build ứng dụng NestJS
RUN npm run build

# Xóa node_modules dev để giảm kích thước image
RUN rm -rf node_modules && npm install --omit=dev

# Mở cổng mà ứng dụng sử dụng
EXPOSE 3000

# Lệnh để chạy ứng dụng trong chế độ production
CMD ["npm", "run", "start:prod"]
