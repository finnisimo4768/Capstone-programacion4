class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.statusCode = status;
  }
}

class ErrorFactory {
  static createError(type, message = "An error occurred", status) {
    switch (type) {
      case "ClientError":
        return new CustomError(message || "Client error", status || 400);
      case "AuthenticationError":
        return new CustomError(
          message || "Authentication failed",
          status || 401,
        );
      case "AuthorizationError":
        return new CustomError(
          message || "Authorization failed",
          status || 403,
        );
      case "NotFoundError":
        return new CustomError(message || "Resource not found", status || 404);
      case "ValidationError":
        return new CustomError(
          message || "Validation error occurred",
          status || 422,
        );
      case "ServerError":
        return new CustomError(
          message || "Internal server error",
          status || 500,
        );
      default:
        throw new Error("Unknown error type");
    }
  }
}

export default ErrorFactory;
