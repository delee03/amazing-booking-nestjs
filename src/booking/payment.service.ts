import * as crypto from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BookingService } from './booking.service';

@Injectable()
export class PaymentService {
  constructor(
    private configService: ConfigService,
    private bookingService: BookingService,
  ) {}

  async createPaymentUrl(bookingId: string, amount: number) {
    const vnpUrl = this.configService.get<string>('VNPAY_URL');
    const vnpTmnCode = this.configService.get<string>('VNPAY_TMN_CODE');
    const vnpHashSecret = this.configService.get<string>('VNPAY_HASH_SECRET')!;
    const vnpReturnUrl = this.configService.get<string>('VNPAY_RETURN_URL');

    const date = new Date();
    const createDate = `${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date
      .getHours()
      .toString()
      .padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;

    let vnp_Params: {
      vnp_Version: string;
      vnp_Command: string;
      vnp_TmnCode: string | undefined;
      vnp_Amount: number;
      vnp_CurrCode: string;
      vnp_TxnRef: string;
      vnp_OrderInfo: string;
      vnp_OrderType: string;
      vnp_Locale: string;
      vnp_ReturnUrl: string | undefined;
      vnp_IpAddr: string;
      vnp_CreateDate: string;
      vnp_SecureHash?: string;
    } = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpTmnCode,
      vnp_Amount: amount * 10, // số tiền cần nhân 100
      vnp_CurrCode: 'VND',
      vnp_TxnRef: bookingId, // mã booking
      vnp_OrderInfo: `Thanh toan cho booking ${bookingId}`,
      vnp_OrderType: 'billpayment',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: vnpReturnUrl,
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    vnp_Params = this.sortObject(vnp_Params);

    const signData = this.createQueryString(vnp_Params);
    const hmac = crypto.createHmac('sha512', vnpHashSecret);
    const signed = hmac.update(signData).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    const query = this.createQueryString(vnp_Params);
    return `${vnpUrl}?${query}`;
  }

  private createQueryString(params: any) {
    return Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&');
  }

  private sortObject(obj: any) {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      sorted[key] = obj[key];
    });
    return sorted;
  }

  // Hàm lấy tổng tiền của booking dựa trên bookingId
  async getBookingAmount(bookingId: string): Promise<number> {
    // Tìm booking theo bookingId
    const booking = await this.bookingService.findOne(bookingId);

    // Kiểm tra nếu booking không tồn tại
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    // Lấy giá trị `totalPrice` từ booking
    const amount = booking.totalPrice;

    return amount;
  }
  // Phương thức mới để cập nhật trạng thái thanh toán của booking
  async updateBookingStatus(bookingId: string) {
    return this.bookingService.update2(bookingId, { paymentStatus: true });
  }
}
