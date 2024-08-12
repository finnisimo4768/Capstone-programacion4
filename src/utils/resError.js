const resError = (response, status, message) => {
  response.status(status).json({
    error: true,
    message,
  });
};

export { resError };
