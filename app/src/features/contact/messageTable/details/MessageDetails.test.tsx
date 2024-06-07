import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { renderWithProviders } from "@/utils/test/testUtils";

import MessageDetails from "./MessageDetails";

const mockUpdateMessage = vi.fn();

const MESSAGE_DATA = {
  id: "dummy-message-id-1",
  sender: "John Doe",
  message: "Some dummy text that user send.",
  email: "john@doe.com",
  unread: true,
  createdAt: "2024-02-17T09:19:32.712Z",
};

let mockUseGetMessageQueryData = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: {},
  data: MESSAGE_DATA,
};

let mockUseUpdateMessageMutationData = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: {},
};

vi.mock("@/features/contact/store/contactApiSlice", async () => ({
  ...(await vi.importActual<Record<string, unknown>>(
    "@/features/contact/store/contactApiSlice"
  )),
  useGetMessageQuery: () => mockUseGetMessageQueryData,
  useUpdateMessageMutation: () => [
    mockUpdateMessage,
    mockUseUpdateMessageMutationData,
  ],
}));

describe("<MessageDetails/>", () => {
  beforeEach(() => {
    mockUseGetMessageQueryData = {
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: {},
      data: MESSAGE_DATA,
    };

    mockUseUpdateMessageMutationData = {
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: {},
    };
  });

  afterEach(() => {
    mockUpdateMessage.mockReset();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("Layout test", () => {
    beforeEach(() => {
      mockUseGetMessageQueryData = {
        isLoading: false,
        isSuccess: false,
        isError: false,
        error: {},
        data: MESSAGE_DATA,
      };
    });

    it("should render element", () => {
      renderWithProviders(<MessageDetails id={MESSAGE_DATA.id} />);

      expect(
        screen.getByText(`Message from ${MESSAGE_DATA.sender}`)
      ).toBeInTheDocument();
      expect(screen.getByText("Send on date:")).toBeInTheDocument();
      expect(screen.getByText("Sender:")).toBeInTheDocument();
      expect(screen.getByText("Email:")).toBeInTheDocument();
      expect(screen.getByText(MESSAGE_DATA.email)).toBeInTheDocument();
      expect(
        screen.getByText(`Mark as ${MESSAGE_DATA.unread ? "readed" : "unread"}`)
      ).toBeInTheDocument();
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
      expect(screen.getByText(MESSAGE_DATA.message)).toBeInTheDocument();
    });

    it("should render loader if query request is in loading state", () => {
      mockUseGetMessageQueryData = {
        ...mockUseGetMessageQueryData,
        isLoading: true,
      };
      renderWithProviders(<MessageDetails id={MESSAGE_DATA.id} />);

      expect(screen.getByTestId("message-details-loader")).toBeInTheDocument();
    });

    it("should render error message if request fails", () => {
      mockUseGetMessageQueryData = {
        ...mockUseGetMessageQueryData,
        isError: true,
        error: {
          data: "Error occurred",
        },
      };
      renderWithProviders(<MessageDetails id={MESSAGE_DATA.id} />);

      expect(screen.getByText("Error occurred.")).toBeInTheDocument();
    });

    it("should render info alert if there is no data for message", () => {
      mockUseGetMessageQueryData = {
        ...mockUseGetMessageQueryData,
        data: undefined as any,
      };
      renderWithProviders(<MessageDetails id={MESSAGE_DATA.id} />);

      expect(
        screen.getByText("There is no data for this message")
      ).toBeInTheDocument();
    });
  });

  describe("Handling update logic test", () => {
    beforeEach(() => {
      mockUpdateMessage.mockReset();

      mockUseUpdateMessageMutationData = {
        isLoading: false,
        isSuccess: false,
        isError: false,
        error: {},
      };
    });

    it("should show error if update request fails", () => {
      mockUseUpdateMessageMutationData = {
        ...mockUseUpdateMessageMutationData,
        isError: true,
        error: {
          data: "Error updating occurred",
        },
      };
      renderWithProviders(<MessageDetails id={MESSAGE_DATA.id} />);

      expect(screen.getByText("Error updating occurred.")).toBeInTheDocument();
    });

    it("should disable checkbox if request is in progress", () => {
      mockUseUpdateMessageMutationData = {
        ...mockUseUpdateMessageMutationData,
        isLoading: true,
      };
      renderWithProviders(<MessageDetails id={MESSAGE_DATA.id} />);

      expect(
        screen.getByRole("checkbox").hasAttribute("disabled")
      ).toBeTruthy();
    });

    it("should disable checkbox if request is in progress", async () => {
      renderWithProviders(<MessageDetails id={MESSAGE_DATA.id} />);

      await userEvent.click(screen.getByRole("checkbox"));

      expect(mockUpdateMessage).toHaveBeenCalledWith(MESSAGE_DATA.id);
    });
  });
});
