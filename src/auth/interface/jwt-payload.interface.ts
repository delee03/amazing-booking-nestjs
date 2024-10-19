export interface JwtPayload {
  sub: string; // Subject: Chuỗi ID của user
  email: string;
  iat?: number; // Issued At: Thời gian token được tạo
  exp?: number; // Expiration: Thời gian token hết hạn
}
