export const handleResponse = (
  message: string = 'Trả dữ liệu thành công',
  data: any,
  statusCode: number = 200,
) => {
  return {
    message,
    statusCode,
    content: data,
  };
};
