import { renderHook, screen } from "@testing-library/react";
import { expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { renderWithProviders } from "@/utils/test/testUtils";

import CustomTable from "./CustomTable";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const mockOnSortingChangeHandler = vi.fn();

const columnHelper = createColumnHelper<{ id: string; email: string }>();

const COLUMNS = [
  columnHelper.accessor("id", {
    header: () => "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: () => "Email",
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
];

const TABLE_DATA = {
  data: [
    { id: "1", email: "test@test.com" },
    { id: "2", email: "test2@test.com" },
  ],
  columns: COLUMNS,
  pageCount: 1,
  state: undefined,
  onSortingChange: mockOnSortingChangeHandler,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  manualPagination: true,
};

describe("<CustomTable/>", () => {
  beforeEach(() => {
    mockOnSortingChangeHandler.mockReset();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("Layout test", () => {
    it("should render data in table", () => {
      const { result } = renderHook(() => useReactTable(TABLE_DATA));
      renderWithProviders(
        <CustomTable
          tableData={result.current}
          isError={false}
          isLoading={false}
          error={undefined}
        />
      );

      expect(screen.getByText("ID")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("test@test.com")).toBeInTheDocument();
      expect(screen.getByText("test2@test.com")).toBeInTheDocument();
    });

    it("should render loader if is loading", () => {
      const { result } = renderHook(() => useReactTable(TABLE_DATA));
      renderWithProviders(
        <CustomTable
          tableData={result.current}
          isError={false}
          isLoading={true}
          error={undefined}
        />
      );

      expect(screen.getByTestId("custom-table-loader")).toBeInTheDocument();
    });

    it("should render error message if error happen", () => {
      const { result } = renderHook(() => useReactTable(TABLE_DATA));
      renderWithProviders(
        <CustomTable
          tableData={result.current}
          isError={true}
          isLoading={false}
          error={{ data: "Custom error ocurred", status: 404 }}
        />
      );

      expect(screen.getByText("Custom error ocurred.")).toBeInTheDocument();
    });

    it("should render message for no date if data is not set", () => {
      const { result } = renderHook(() =>
        useReactTable({ ...TABLE_DATA, data: [] })
      );
      renderWithProviders(
        <CustomTable
          tableData={result.current}
          isError={false}
          isLoading={false}
          error={undefined}
        />
      );

      expect(screen.getByText("There is no data.")).toBeInTheDocument();
    });

    it("should render caption and footer if passed", () => {
      const { result } = renderHook(() =>
        useReactTable({ ...TABLE_DATA, data: [] })
      );
      renderWithProviders(
        <CustomTable
          tableData={result.current}
          isError={false}
          isLoading={false}
          error={undefined}
          captionElement={"Caption"}
          footerElement={"Footer"}
        />
      );

      expect(screen.getByText("Caption")).toBeInTheDocument();
      expect(screen.getByText("Footer")).toBeInTheDocument();
    });
  });

  describe("Sorting test", () => {
    it("should sort data if sorting is enabled on column", async () => {
      const { result } = renderHook(() => useReactTable(TABLE_DATA));
      renderWithProviders(
        <CustomTable
          tableData={result.current}
          isError={false}
          isLoading={false}
          error={undefined}
        />
      );

      await userEvent.click(screen.getByText("ID"));

      expect(mockOnSortingChangeHandler).toBeCalledTimes(1);
    });

    it("should not sort data if sorting is not enabled on column", async () => {
      const { result } = renderHook(() => useReactTable(TABLE_DATA));
      renderWithProviders(
        <CustomTable
          tableData={result.current}
          isError={false}
          isLoading={false}
          error={undefined}
        />
      );

      await userEvent.click(screen.getByText("Email"));

      expect(mockOnSortingChangeHandler).toBeCalledTimes(0);
    });
  });
});
