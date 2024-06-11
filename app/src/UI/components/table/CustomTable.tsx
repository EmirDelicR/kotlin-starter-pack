import { ReactNode } from 'react';

import { Alert, Box, Center, Loader, Table, Text } from '@mantine/core';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { IconInfoCircle } from '@tabler/icons-react';
import { Table as TableType, flexRender } from '@tanstack/react-table';

import Error from '@/UI/components/error/Error';

import classes from './CustomTable.module.scss';

interface Props<T> {
  isLoading: boolean;
  isError: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
  tableData: TableType<T>;
  captionElement?: ReactNode | string;
  footerElement?: ReactNode | string;
}

function TableHead<T>({ tableData }: Pick<Props<T>, 'tableData'>) {
  return (
    <Table.Thead>
      {tableData.getHeaderGroups().map((headerGroup) => (
        <Table.Tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <Table.Th key={header.id}>
              <Box
                className={
                  header.column.getCanSort() ? classes['sort-header'] : ''
                }
                onClick={header.column.getToggleSortingHandler()}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                {{
                  asc: ' ▲',
                  desc: ' ▼'
                }[header.column.getIsSorted() as string] ?? ' '}
              </Box>
            </Table.Th>
          ))}
        </Table.Tr>
      ))}
    </Table.Thead>
  );
}

function TableBody<T>({ tableData }: Pick<Props<T>, 'tableData'>) {
  return (
    <Table.Tbody>
      {tableData.getRowModel().rows.map((row) => (
        <Table.Tr key={row.id}>
          {row.getVisibleCells().map((cell) => {
            return (
              <Table.Td key={cell.id}>
                {cell.column.getIsLastColumn() ? (
                  flexRender(cell.column.columnDef.cell, cell.getContext())
                ) : (
                  <Box maw={200}>
                    <Text truncate="end">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Text>
                  </Box>
                )}
              </Table.Td>
            );
          })}
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
}

export default function CustomTable<T>({
  tableData,
  isLoading,
  isError,
  error,
  captionElement,
  footerElement
}: Props<T>) {
  const renderTableData = () => {
    if (isLoading || isError || tableData.getRowModel().rows.length === 0) {
      return (
        <Table.Tbody>
          <Table.Tr>
            <Table.Td colSpan={tableData.getAllColumns().length}>
              {isLoading ? (
                <Center p="md">
                  <Loader
                    size="lg"
                    type="bars"
                    data-testid="custom-table-loader"
                  />
                </Center>
              ) : isError ? (
                <Error isError={isError} error={error} />
              ) : (
                <Alert variant="light" color="blue" icon={<IconInfoCircle />}>
                  There is no data.
                </Alert>
              )}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      );
    }

    return <TableBody<T> tableData={tableData} />;
  };

  return (
    <Table.ScrollContainer minWidth={800} type="native">
      <Table
        striped
        highlightOnHover
        withTableBorder
        captionSide="top"
        data-testid="table"
      >
        <TableHead<T> tableData={tableData} />
        {renderTableData()}
        <Table.Caption>{captionElement}</Table.Caption>
        <Table.Tfoot>
          <Table.Tr>
            <Table.Td colSpan={tableData.getAllColumns().length}>
              {footerElement}
            </Table.Td>
          </Table.Tr>
        </Table.Tfoot>
      </Table>
    </Table.ScrollContainer>
  );
}
