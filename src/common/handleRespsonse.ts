export const handleResponse = (message: '', data: any, status: number) => {
  return {
    message,
    content: data,
    status,
  };
};
