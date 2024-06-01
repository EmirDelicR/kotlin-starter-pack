import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const classNameHelper = (...args: string[]): string => {
  const classes = args.filter((entry) => entry && entry.trim() !== "");
  return classes.toString().replaceAll(",", " ").trim();
};

export const localStorageHelper = <T>(key: string) => {
  const getValue = (key: string): string | null => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      return null;
    }
  };

  const setValue = (value: T) => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return [setValue, getValue] as const;
};

export const normalizeError = (
  error:
    | Partial<FetchBaseQueryError>
    | SerializedError
    | { error: string }
    | undefined
) => {
  if (error === undefined) {
    return { id: "-1", message: "Undefined Error occurred!" };
  }
  let message = "";

  if ("status" in error && typeof error.status === "string") {
    message = `${error.status} | `;
  }

  if ("error" in error) {
    message += `${error.error} | `;
  }

  if ("data" in error && typeof error.data === "string") {
    message += `${error.data}.`;
  }

  if (
    "data" in error &&
    typeof error.data === "object" &&
    "message" in (error.data as { message: "string" })
  ) {
    message += `${(error.data as { message: "string" }).message}.`;
  }

  if (message.trim().length === 0) {
    message = "Unknown Error Happen no additional data!";
  }

  return { id: crypto.randomUUID(), message: message.trim() };
};
