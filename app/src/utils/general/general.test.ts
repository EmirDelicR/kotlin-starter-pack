import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { classNameHelper, localStorageHelper, normalizeError } from "./general";

const RANDOM_ID = "random-id";

describe("General utils test", () => {
  Object.defineProperty(window, "crypto", {
    value: { randomUUID: () => RANDOM_ID },
  });

  describe("classNameHelper utils function", () => {
    it("should return string from arguments array", () => {
      expect(classNameHelper("")).toEqual("");
      expect(classNameHelper(" ")).toEqual("");
      expect(classNameHelper()).toEqual("");
      expect(classNameHelper("test")).toEqual("test");
      expect(classNameHelper("test", "test_1", "test_2")).toEqual(
        "test test_1 test_2"
      );
      expect(classNameHelper("test", " ", "test_2")).toEqual("test test_2");
      expect(classNameHelper("test", "    ", "", "test_2")).toEqual(
        "test test_2"
      );
      expect(classNameHelper("test", " ", "", "  ", "test_2   ", "")).toEqual(
        "test test_2"
      );
    });
  });

  describe("localStorageHelper utils function", () => {
    const mockGetItem = vi.fn();
    const mockSetItem = vi.fn();
    const realLocalStorage = window.localStorage;
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
      },
    });

    afterAll(() => {
      Object.defineProperty(window, "localStorage", realLocalStorage);
    });

    it("should call localStorage functions", () => {
      const [setValue, getValue] = localStorageHelper("test");
      setValue(null);
      getValue("test");

      expect(mockSetItem).toHaveBeenCalledWith("test", "null");
      expect(mockGetItem).toHaveBeenCalledWith("test");
    });
  });

  describe("normalizeError utils function", () => {
    const errorMock: Partial<FetchBaseQueryError> = {
      status: "CUSTOM_ERROR",
      data: { message: "Some data" },
      error: "Some error",
    };

    it("should return default error message if error is undefined", () => {
      expect(normalizeError(undefined)).toEqual({
        id: "-1",
        message: "Undefined Error occurred!",
      });
    });

    it("should return all the data from error", () => {
      expect(normalizeError(errorMock)).toEqual({
        id: RANDOM_ID,
        message: "CUSTOM_ERROR | Some error | Some data.",
      });
    });

    it("should remove Some data. from error message", () => {
      delete errorMock.data;
      expect(normalizeError(errorMock)).toEqual({
        id: RANDOM_ID,
        message: "CUSTOM_ERROR | Some error |",
      });
    });

    it("should remove Some error from error message", () => {
      delete errorMock.error;
      expect(normalizeError(errorMock)).toEqual({
        id: RANDOM_ID,
        message: "CUSTOM_ERROR |",
      });
    });

    it("should return general message if ", () => {
      delete errorMock.status;
      expect(normalizeError(errorMock)).toEqual({
        id: RANDOM_ID,
        message: "Unknown Error Happen no additional data!",
      });
    });
  });
});
