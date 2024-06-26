import { useEffect, useMemo, useState } from 'react';

import { Center, Flex, Pagination, Select } from '@mantine/core';
import {
  PaginationState,
  SortingState,
  Updater,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';

import DebounceInput from '@/UI/components/debounceInput/DebounceInput';
import CustomTable from '@/UI/components/table/CustomTable';
import { ITEMS_PER_PAGE, POOL_INTERVAL_5_MINUTES } from '@/constants';
import { createPaginationShowList, formatDate } from '@/utils';

import {
  Message,
  useGetPaginatedMessagesQuery
} from '../store/contactApiSlice';
import Actions from './actions/Actions';

type Columns = Message & { actions?: string };

const columnHelper = createColumnHelper<Columns>();

const columns = [
  columnHelper.accessor('id', {
    header: () => 'ID',
    cell: (info) => info.getValue(),
    enableSorting: false
  }),
  columnHelper.accessor('email', {
    header: () => 'Email',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('message', {
    header: () => 'Message',
    cell: (info) => info.getValue(),
    enableSorting: false
  }),
  columnHelper.accessor('sender', {
    header: () => 'Sender',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('createdAt', {
    header: () => 'Created At',
    cell: (info) => formatDate(info.getValue())
  }),
  columnHelper.accessor('unread', {
    header: () => 'Actions',
    cell: (info) => (
      <Actions id={info.row.getValue('id')} unread={info.getValue()} />
    ),
    enableSorting: false
  })
];

export default function MessageTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectValue, setSelectValue] = useState<string | null>(
    `${ITEMS_PER_PAGE}`
  );
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: ITEMS_PER_PAGE
  });

  const { data, isLoading, isError, error } = useGetPaginatedMessagesQuery(
    {
      columnId: sorting[0]?.id || 'createdAt',
      currentPage: pageIndex,
      pageSize: pageSize,
      desc: sorting[0]?.desc ? 'DESC' : 'ASC',
      filter: globalFilter
    },
    { pollingInterval: POOL_INTERVAL_5_MINUTES }
  );

  useEffect(() => {
    if (data?.items?.length === 0 && data?.numberOfPages > 0) {
      setPagination({
        pageIndex: pageIndex - 1,
        pageSize
      });
    }
  }, [data?.items?.length, data?.numberOfPages]);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize
    }),
    [pageIndex, pageSize]
  );

  const onSortingChangeHandler = (sortOptions: Updater<SortingState>) => {
    setPagination({
      pageIndex: 1,
      pageSize: pageSize
    });

    setSorting(sortOptions);
  };

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    pageCount: data?.numberOfPages ?? -1,
    state: {
      pagination,
      sorting,
      globalFilter
    },
    onSortingChange: onSortingChangeHandler,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true
  });

  const totalItems = data?.totalCount || 0;

  const selectValues = useMemo(
    () => createPaginationShowList(totalItems),
    [totalItems]
  );
  const onSelectChange = (value: string | null) => {
    setSelectValue(value);
    table.setPageSize(Number(value));
    setPagination({
      pageIndex: 1,
      pageSize: Number(value)
    });
  };

  const CaptionElement = (
    <Flex justify="space-between" mb="md">
      <DebounceInput
        initialValue={globalFilter ?? ''}
        onChange={setGlobalFilter}
        placeholder="Search..."
        data-testid="search-input"
      />
      <Select
        defaultValue={selectValue}
        multiple={false}
        onChange={onSelectChange}
        data={selectValues}
        data-testid="show-entry-select"
      />
    </Flex>
  );

  const FooterElement = (
    <Center py="lg" miw="100%">
      <Pagination
        value={pageIndex}
        total={table.getPageCount()}
        onChange={(index) => {
          table.setPagination({
            pageIndex: index,
            pageSize: pageSize
          });
        }}
      />
    </Center>
  );

  return (
    <CustomTable<Columns>
      tableData={table}
      isLoading={isLoading}
      isError={isError}
      error={error}
      captionElement={CaptionElement}
      footerElement={FooterElement}
    />
  );
}
