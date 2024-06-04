import { waitFor } from "@testing-library/react";
import { vi } from "vitest";

import useAutoLogin from "@/hooks/useAutoLogin";
import { renderHookWithProviders } from "@/utils/test/testUtils";

const mockGetData = vi.fn();
const mockAutoLogin = vi.fn();
const mockDispatch = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@/utils", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("@/utils")),
  localStorageHelper: () => [vi.fn(), mockGetData],
}));

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("react-router-dom")),
  useNavigate: () => mockNavigate,
}));

vi.mock("@/features/auth/store/authApiSlice", async () => ({
  ...(await vi.importActual<Record<string, unknown>>(
    "@/features/auth/store/authApiSlice"
  )),
  useAutoLoginMutation: () => [mockAutoLogin],
}));

vi.mock("@/store", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("@/store")),
  useAppDispatch: () => mockDispatch,
}));

vi.mock("@/store/userSlice", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("@/store/userSlice")),
  setUser: vi.fn().mockReturnValue("user"),
}));

describe("useAutoLogin hook test", () => {
  beforeEach(() => {
    mockGetData.mockReset().mockReturnValue("token");
    mockAutoLogin.mockReset().mockResolvedValue({ data: { status: 200 } });
    mockDispatch.mockReset();
    mockNavigate.mockReset();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("Should not call dispatch and setUser if token is not set", async () => {
    mockGetData.mockReturnValue(null);
    renderHookWithProviders(() => useAutoLogin());

    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalledTimes(1);
      expect(mockAutoLogin).toHaveBeenCalledTimes(0);
      expect(mockDispatch).toHaveBeenCalledTimes(0);
    });
  });

  it("Should not call dispatch and setUser if response status is not 200", async () => {
    mockAutoLogin.mockResolvedValue({ data: { status: 400 } });
    renderHookWithProviders(() => useAutoLogin());

    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalledTimes(1);
      expect(mockAutoLogin).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledTimes(0);
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  it("Should call dispatch and setUser if response status is 200", async () => {
    renderHookWithProviders(() => useAutoLogin());

    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalledTimes(1);
      expect(mockAutoLogin).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledTimes(0);
    });
  });
});
