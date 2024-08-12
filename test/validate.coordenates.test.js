import { validateCoordinates } from "../src/utils/validateCoordinates.js";

describe("validateCoordinates", () => {
  it("should return true for coordinates within bounds", () => {
    const width = 10;
    const height = 10;
    const coordinates = [
      [0, 0],
      [5, 5],
      [9, 9],
    ];
    expect(validateCoordinates(width, height, coordinates)).toBe(true);
  });

  it("should return true for coordinates on the boundary", () => {
    const width = 10;
    const height = 10;
    const coordinates = [
      [0, 0],
      [0, 9],
      [9, 0],
      [9, 9],
    ];
    expect(validateCoordinates(width, height, coordinates)).toBe(true);
  });

  it("should return false for coordinates outside the boundary", () => {
    const width = 10;
    const height = 10;
    const coordinates = [
      [-1, 0], // x is less than 0
      [10, 5], // x is equal to width
      [5, -1], // y is less than 0
      [5, 10], // y is equal to height
    ];
    expect(validateCoordinates(width, height, coordinates)).toBe(false);
  });

  it("should return true for an empty array of coordinates", () => {
    const width = 10;
    const height = 10;
    const coordinates = [];
    expect(validateCoordinates(width, height, coordinates)).toBe(true);
  });
});
