export const handleResponse = (
  message: '',
  data: any,
  status: number = 200,
) => {
  return {
    message,
    content: data,
    status,
  };
};
