import { renderHook } from "@testing-library/react";
import useLogout from "../useLogout";

import { NavRoutes } from "@/constants";

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-router-dom")),
  useNavigate: () => mockNavigate,
}));

vi.mock("@/store", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("@/store")),
  useAppDispatch: () => mockDispatch,
}));

describe("useLogout hook test", () => {
  beforeEach(() => {
    mockDispatch.mockReset();
    mockNavigate.mockReset();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("Should dispatch logout action and navigate to login page", () => {
    const { result } = renderHook(() => useLogout());

    result.current();

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(`/${NavRoutes.AUTH}`);
  });

  it("Should not dispatch logout action and navigate to login page if function is not invoke", () => {
    renderHook(() => useLogout());

    expect(mockDispatch).toHaveBeenCalledTimes(0);
    expect(mockNavigate).toHaveBeenCalledTimes(0);
  });
});
