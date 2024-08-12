const reply = (response, statusCode, data) => {
  response.status(statusCode).json({
    error: false,
    data,
  });
};

export { reply };
