import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import useAsyncEffect from "@/hooks/useAsyncEffect";

describe("useAsyncEffect hook test", () => {
  const actionFunction = vi.fn().mockResolvedValue(Promise.resolve());

  beforeEach(() => {
    actionFunction.mockReset();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("Should call passed function", async () => {
    renderHook(() => useAsyncEffect(actionFunction));

    await waitFor(() => {
      expect(actionFunction).toHaveBeenCalledTimes(1);
    });
  });
});
