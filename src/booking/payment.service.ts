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
    const vnpHashSecret = this.configService.get<string>('VNPAY_HASH_SECRET');
    const vnpReturnUrl = this.configService.get<string>('VNPAY_RETURN_URL');
    console.log({
      vnpUrl,
      vnpTmnCode,
      vnpHashSecret,
      vnpReturnUrl,
    });

    if (!vnpHashSecret || !vnpUrl || !vnpTmnCode || !vnpReturnUrl) {
      throw new Error('One or more VNPAY configuration values are missing');
    }

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

    // Thiết lập các tham số cần thiết mà không mã hóa OrderInfo
    let vnp_Params: any = {
      vnp_Version: this.configService.get<string>('VNPAY_VERSION') || '2.1.0',
      vnp_Command: this.configService.get<string>('VNPAY_COMMAND') || 'pay',
      vnp_TmnCode: vnpTmnCode,
      vnp_Amount: amount * 100,
      vnp_CurrCode: this.configService.get<string>('VNPAY_CURR_CODE') || 'VND',
      vnp_TxnRef: bookingId,
      vnp_OrderInfo: `Thanh toan cho booking ${bookingId}`,
      vnp_OrderType: 'billpayment',
      vnp_Locale: this.configService.get<string>('VNPAY_LOCALE') || 'vn',
      vnp_ReturnUrl: vnpReturnUrl,
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    // Sắp xếp các tham số theo thứ tự từ điển
    const sortedParams = this.sortObject(vnp_Params);

    // Tạo chuỗi ký kết từ các tham số đã sắp xếp (không mã hóa URL tại đây)
    const signData = Object.keys(sortedParams)
      .map((key) => `${key}=${sortedParams[key]}`)
      .join('&');

    // Mã hóa SHA512
    const hmac = crypto.createHmac('sha512', vnpHashSecret);
    const signed = hmac.update(signData).digest('hex');
    sortedParams['vnp_SecureHash'] = signed;

    // Tạo URL hoàn chỉnh và chỉ mã hóa đúng cách ở bước cuối
    const query = Object.keys(sortedParams)
      .map((key) => `${key}=${encodeURIComponent(sortedParams[key])}`)
      .join('&');

    console.log('Final URL:', `${vnpUrl}?${query}`);
    return `${vnpUrl}?${query}`;
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
    const booking = await this.bookingService.findOne(bookingId);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
    return booking.content.totalPrice;
  }

  // Phương thức mới để cập nhật trạng thái thanh toán của booking
  async updateBookingStatus(bookingId: string) {
    return this.bookingService.update2(bookingId, { paymentStatus: true });
  }
}
