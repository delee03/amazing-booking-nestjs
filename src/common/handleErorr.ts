export const handleErorr = (
  message: string,
  status: number = 500,
  error: any,
) => {
  return {
    message,
    status,
    content: error.stack,
  };
};
