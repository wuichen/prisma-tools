import React, { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import { breakpointDown } from '@paljs/ui/breakpoints';
import { Card, CardBody } from '@paljs/ui/Card';
import { Button } from '@paljs/ui/Button';
import { EvaIcon } from '@paljs/ui/Icon';
import { InputGroup } from '@paljs/ui/Input';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import Popover from '@paljs/ui/Popover';
import { columns } from './Columns';
import { initPages } from './utils';
import { TableContext } from '../Context';
import Spinner from '@paljs/ui/Spinner';
import Tooltip from '@paljs/ui/Tooltip';
import { Checkbox } from '@paljs/ui/Checkbox';
import { ListConnect } from './ListConnect';

interface TableProps {
  inEdit?: boolean;
  model: string;
  data: any[];
  fetchMore: (pageSize: number, pageIndex: number) => void;
  loading: boolean;
  pageCount: number;
  initialFilter: { id: string; value: any }[];
  sortByHandler: (sortBy: { id: string; desc: boolean }[]) => void;
  filterHandler: (filters: { id: string; value: any }[]) => void;
  onAction: (action: 'create' | 'delete' | 'connect', value?: unknown) => void;
  connect?: any;
  parent?: { name: string; value: any; field: string };
}

export const Table: React.FC<TableProps> = ({
  initialFilter,
  model: modelName,
  data,
  fetchMore,
  loading,
  pageCount: controlledPageCount,
  sortByHandler,
  filterHandler,
  onAction,
  inEdit,
  connect,
  parent,
}) => {
  const {
    schema: { models },
    push,
    pagesPath,
    pageSizeOptions,
    paginationOptions,
    tableColumns,
    onSelect,
  } = useContext(TableContext);
  const model = models.find((item) => item.id === modelName);
  const columnList = columns(model, tableColumns);
  const tableInstance = useTable(
    {
      columns: columnList,
      data,
      initialState: { pageIndex: 0, filters: initialFilter }, // Pass our hoisted table state
      manualFilters: true,
      manualSortBy: true,
      manualPagination: true,
      pageCount: controlledPageCount,
    } as any,
    useFilters,
    useSortBy,
    usePagination,
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setAllFilters,
    state: { pageIndex, pageSize, filters, sortBy },
  } = tableInstance as any;

  const tableRef = useRef<HTMLTableElement>(null);
  const [columnSize, setColumnSize] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  // Listen for changes in pagination and use the state to fetch our new data

  const onSelectHandler = (state: boolean, id?: any) => {
    let newValues: any[];
    if (!state && !id) {
      newValues = [];
      setSelected(newValues);
    } else if (state && !id && model) {
      newValues = data.map((row) => row[model.idField]);
      setSelected(newValues);
    } else if (!state && id) {
      newValues = selected.filter((value) => value !== id);
      setSelected(newValues);
    } else {
      newValues = [...selected, id];
      setSelected(newValues);
    }
    onSelect && onSelect(newValues);
  };

  React.useEffect(() => {
    fetchMore(pageSize, pageIndex);
  }, [fetchMore, pageIndex, pageSize]);

  React.useEffect(() => {
    sortByHandler(sortBy);
  }, [sortBy]);

  React.useEffect(() => {
    filterHandler(filters);
  }, [filters]);

  React.useEffect(() => {
    function columnHandler() {
      const clientRect = tableRef?.current?.getBoundingClientRect();
      if (clientRect) {
        setColumnSize(clientRect.width / columnList.length);
      }
    }

    if (columnList.length > 0) columnHandler();
    window.addEventListener('resize', columnHandler);
    return () => {
      window.removeEventListener('resize', columnHandler);
    };
  }, [columnList]);

  const actions = {
    create: model?.create,
    update: model?.update,
    delete: model?.delete,
  };

  const isSelect = onSelect && !inEdit;

  const hasFilters = filters.length > 0;

  const parentModel = models.find((item) => item.id === parent?.name);
  const fieldUpdate = parentModel?.fields.find((f) => f.name === parent?.field)
    ?.update;
  // Render the UI for your table
  return (
    <Card style={{ marginBottom: 0, maxHeight: '100vh' }}>
      {!inEdit && (
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {model?.name}
        </header>
      )}
      <CardBody id="popoverScroll">
        {loading && <Spinner size="Giant" />}
        <StyledTable
          ref={tableRef}
          {...getTableProps()}
          columnSize={columnSize}
        >
          <thead>
            {headerGroups.map((headerGroup: any, index: number) => (
              <React.Fragment key={index}>
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {isSelect && <th>Select</th>}
                  <th colSpan={2}>Actions</th>
                  {fieldUpdate && parent && <th>Relation</th>}
                  {headerGroup.headers.map((column: any, index2: number) => (
                    <th
                      key={index2}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </th>
                  ))}
                </tr>
                <tr>
                  {isSelect && (
                    <th>
                      <Checkbox
                        onChange={onSelectHandler}
                        checked={
                          data.length > 0 && selected.length === data.length
                        }
                        indeterminate={
                          selected.length > 0 && selected.length !== data.length
                        }
                      />
                    </th>
                  )}
                  {connect ? (
                    <th colSpan={2} />
                  ) : (
                    <th colSpan={2}>
                      {actions.create && (
                        <Button size="Tiny" onClick={() => onAction('create')}>
                          <EvaIcon name="plus-outline" />
                        </Button>
                      )}
                    </th>
                  )}
                  {fieldUpdate && parent && (
                    <th>
                      <Button
                        size="Small"
                        shape="SemiRound"
                        onClick={() => {
                          if (hasFilters) {
                            setAllFilters([]);
                          } else {
                            setAllFilters(initialFilter);
                          }
                        }}
                      >
                        {hasFilters ? 'View All' : 'View Related'}
                      </Button>
                    </th>
                  )}
                  {headerGroup.headers.map((column: any, index: number) => (
                    <th key={index}>
                      <div>
                        {column.canFilter ? column.render('Filter') : null}
                      </div>
                    </th>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row: any, index: number) => {
              prepareRow(row);
              return (
                <tr key={index} {...row.getRowProps()}>
                  {isSelect && (
                    <td>
                      <Checkbox
                        onChange={(value) =>
                          onSelectHandler(
                            value,
                            model && row.original[model.idField],
                          )
                        }
                        checked={
                          !!(
                            model &&
                            selected.includes(row.original[model.idField])
                          )
                        }
                      />
                    </td>
                  )}
                  {connect && (
                    <td colSpan={2}>
                      <Button
                        size="Small"
                        appearance="ghost"
                        status="Success"
                        disabled={
                          model &&
                          connect[model.idField] === row.original[model.idField]
                        }
                        onClick={() =>
                          onAction(
                            'connect',
                            data.find(
                              (item) =>
                                model &&
                                item[model.idField] ===
                                  row.original[model.idField],
                            ),
                          )
                        }
                      >
                        {model &&
                        connect[model.idField] === row.original[model.idField]
                          ? 'Connected'
                          : 'Connect'}
                      </Button>
                    </td>
                  )}
                  {!connect && (
                    <td colSpan={actions.delete ? 1 : 2}>
                      <Tooltip
                        className="inline-block"
                        status="Primary"
                        trigger="hint"
                        placement="top"
                        content={actions.update ? 'Edit Row' : 'View Row'}
                      >
                        <Button
                          style={{ padding: 0 }}
                          appearance="ghost"
                          onClick={() =>
                            model &&
                            push(
                              `${pagesPath}${modelName}?${
                                actions.update ? 'update' : 'view'
                              }=${row.original[model.idField]}`,
                            )
                          }
                        >
                          <EvaIcon
                            name={
                              actions.update ? 'edit-outline' : 'eye-outline'
                            }
                          />
                        </Button>
                      </Tooltip>
                    </td>
                  )}
                  {actions.delete && !connect && (
                    <td colSpan={1}>
                      <Tooltip
                        className="inline-block"
                        status="Danger"
                        trigger="hint"
                        placement="top"
                        content="Delete Row"
                      >
                        <Button
                          style={{ padding: 0 }}
                          status="Danger"
                          appearance="ghost"
                          onClick={() => {
                            const confirm = window.confirm(
                              'Are you sure you want to delete this record ?',
                            );
                            if (confirm && model)
                              onAction('delete', row.original[model.idField]);
                          }}
                        >
                          <EvaIcon name="trash-2-outline" />
                        </Button>
                      </Tooltip>
                    </td>
                  )}
                  {parent && model && fieldUpdate && (
                    <ListConnect parent={parent} row={row} model={model} />
                  )}
                  {row.cells.map((cell: any, index2: number) => {
                    return (
                      <td key={index2} {...cell.getCellProps()}>
                        {cell.value &&
                        cell.value.length > Math.floor(columnSize / 6) ? (
                          <Popover
                            eventListener="#popoverScroll"
                            trigger="click"
                            placement="top"
                            overlay={
                              <Card
                                style={{
                                  marginBottom: '0',
                                  maxHeight: '300px',
                                }}
                              >
                                <CardBody>
                                  <div
                                    style={{ maxWidth: '300px' }}
                                    dangerouslySetInnerHTML={{
                                      __html: cell.value,
                                    }}
                                  />
                                </CardBody>
                              </Card>
                            }
                          >
                            <div style={{ cursor: 'pointer' }}>
                              {cell.render('Cell')}
                            </div>
                          </Popover>
                        ) : (
                          cell.render('Cell')
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr>
              <td colSpan={10000}>
                Showing {page.length} of ~{controlledPageCount * pageSize}{' '}
                results
              </td>
            </tr>
          </tbody>
        </StyledTable>
      </CardBody>
      <footer>
        <StyledRow middle="xs">
          <Col breakPoint={{ md: 12, lg: 4 }}>
            <Tooltip
              className="inline-block"
              status="Primary"
              trigger="hint"
              placement="top"
              content="Go to first page"
            >
              <StyledButton
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <EvaIcon name="arrowhead-left-outline" />
              </StyledButton>
            </Tooltip>
            <StyledButton
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <EvaIcon name="arrow-ios-back" />
            </StyledButton>
            {initPages(pageCount, pageIndex + 1, paginationOptions).map(
              (item) => (
                <StyledButton
                  key={item}
                  onClick={() => gotoPage(item - 1)}
                  status={item === pageIndex + 1 ? 'Primary' : 'Basic'}
                >
                  {item}
                </StyledButton>
              ),
            )}
            <StyledButton onClick={() => nextPage()} disabled={!canNextPage}>
              <EvaIcon name="arrow-ios-forward" />
            </StyledButton>
            <Tooltip
              className="inline-block"
              status="Primary"
              trigger="hint"
              placement="top"
              content="Go to last page"
            >
              <StyledButton
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                <EvaIcon name="arrowhead-right-outline" />
              </StyledButton>
            </Tooltip>
          </Col>
          <Col breakPoint={{ md: 12, lg: 4 }}>
            <InputGroup size="Small" style={{ justifyContent: 'center' }}>
              <input
                placeholder="Go Page Number"
                type="number"
                value={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
              />
            </InputGroup>
          </Col>
          <Col breakPoint={{ md: 12, lg: 4 }}>
            {pageSizeOptions.map((item) => (
              <Tooltip
                key={item}
                className="inline-block"
                status="Primary"
                trigger="hint"
                placement="top"
                content={'Set page size ' + item}
              >
                <StyledButton
                  onClick={() => setPageSize(item)}
                  status={item === pageSize ? 'Primary' : 'Basic'}
                >
                  {item}
                </StyledButton>
              </Tooltip>
            ))}
          </Col>
        </StyledRow>
      </footer>
    </Card>
  );
};

const StyledTable = styled.table<{ columnSize: number }>`
  border-spacing: 0;
  width: 100%;
  tbody tr:nth-child(2n) {
    background-color: ${(props) => props.theme.backgroundBasicColor2};
  }
  tbody tr:hover {
    background: ${(props) => props.theme.backgroundBasicColor3} !important;
  }

  thead tr {
    background: ${(props) => props.theme.backgroundBasicColor2};
    th {
      border-top: 1px solid ${(props) => props.theme.backgroundBasicColor3};
      border-left: 1px solid ${(props) => props.theme.backgroundBasicColor3};
      :last-child {
        border-right: 1px solid ${(props) => props.theme.backgroundBasicColor3};
      }
    }
  }

  tr {
    :last-child {
      td {
        text-align: start;
        border: 1px solid ${(props) => props.theme.backgroundBasicColor2};
      }
    }
  }

  td div {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  th,
  td {
    max-width: ${({ columnSize }) => (columnSize > 150 ? columnSize : 150)}px;
    margin: 0;
    padding: 0.5rem;
    border-top: 1px solid ${(props) => props.theme.backgroundBasicColor2};
    border-left: 1px solid ${(props) => props.theme.backgroundBasicColor2};
    text-align: center;
    :last-child {
      border-right: 1px solid ${(props) => props.theme.backgroundBasicColor2};
    }
  }
`;

const StyledButton = styled(Button)`
  margin-right: 5px;
  padding: 0.3rem;
`;

const StyledRow = styled(Row)`
  text-align: center;
  ${breakpointDown('md')`
    & > :not(:last-child) {
      margin-bottom: 20px;
    }
  `}
`;
