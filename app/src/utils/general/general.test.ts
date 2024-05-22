import { classNameHelper } from "./general";

describe("General utils test", () => {
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
});
