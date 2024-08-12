import { reply } from "../src/utils/reply.js";

describe("reply", () => {
  it("should set the correct status code and send the expected JSON response", () => {
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const statusCode = 200;
    const data = { key: "value" };

    reply(response, statusCode, data);

    expect(response.status).toHaveBeenCalledWith(statusCode);

    expect(response.json).toHaveBeenCalledWith({
      error: false,
      data,
    });
  });

  it("should handle different status codes and data", () => {
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const statusCode = 404;
    const data = { message: "Not found" };

    reply(response, statusCode, data);

    expect(response.status).toHaveBeenCalledWith(statusCode);

    expect(response.json).toHaveBeenCalledWith({
      error: false,
      data,
    });
  });
});
