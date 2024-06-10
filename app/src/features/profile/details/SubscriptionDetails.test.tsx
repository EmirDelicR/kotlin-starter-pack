import { screen } from "@testing-library/react";
import { expect, vi } from "vitest";

import { INITIAL_USER_DATA } from "@/store/userSlice";
import { renderWithProviders } from "@/utils/test/testUtils";

import SubscriptionDetails from "./SubscriptionDetails";

let DATA = {
  subscribed: true,
  subscriptions: [{ name: "news" }, { name: "code" }],
};

describe("<SubscriptionDetails/>", () => {
  let PRELOADED_STATE = {
    user: {
      data: {
        ...INITIAL_USER_DATA.data,
        ...DATA,
      },
    },
  };

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("Layout test", () => {
    beforeEach(() => {
      DATA = {
        subscribed: true,
        subscriptions: [{ name: "news" }, { name: "code" }],
      };

      PRELOADED_STATE = {
        user: {
          data: {
            ...INITIAL_USER_DATA.data,
            ...DATA,
          },
        },
      };
    });

    it("should render element", () => {
      renderWithProviders(<SubscriptionDetails />, {
        preloadedState: PRELOADED_STATE,
      });

      expect(
        screen.getByText("Subscription alerts activated")
      ).toBeInTheDocument();
      expect(screen.getByText("news")).toBeInTheDocument();
      expect(screen.getByText("code")).toBeInTheDocument();
      expect(screen.getByText("general")).toBeInTheDocument();
    });

    it("should render element icon for subscribed", () => {
      renderWithProviders(<SubscriptionDetails />, {
        preloadedState: PRELOADED_STATE,
      });

      expect(
        document.getElementsByClassName("tabler-icon-circle-check").length
      ).to.eq(DATA.subscriptions.length);
    });

    it("should render not activated alerts chip if user is not subscribed", () => {
      DATA = {
        subscribed: false,
        subscriptions: [{ name: "news" }, { name: "code" }],
      };

      PRELOADED_STATE = {
        user: {
          data: {
            ...INITIAL_USER_DATA.data,
            ...DATA,
          },
        },
      };
      renderWithProviders(<SubscriptionDetails />, {
        preloadedState: PRELOADED_STATE,
      });

      expect(
        screen.getByText("Subscription alerts not activated")
      ).toBeInTheDocument();
    });
  });
});
