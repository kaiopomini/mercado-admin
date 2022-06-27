import {
  Paper,
  TableContainer,
  Table as MuiTable,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import { Column, TypesIds } from "../../entities/TableFields";

import "./styles.scss";

interface Props {
  columns: Column<
    TypesIds["categories"] | TypesIds["customers"] | TypesIds["products"]
  >[];
  isLoading: boolean;
  rows: any[];
  total: number;
  perPage: number;
  page: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  entityName?: string;
}

export function Table({
  columns,
  isLoading,
  rows,
  total,
  perPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
  entityName = "item",
}: Props) {
  return (
    <Paper id="table">
      <TableContainer className="paper-table">
        <MuiTable stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  onClick={column.action}
                  sortDirection={"asc"}
                >
                  <div className={"table-title" + (column.action && " action")}>
                    {column.label}
                    {column.icon && column.icon}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {isLoading ? (
            <TableBody>
              <tr>
                <td colSpan={5} className="loading-table">
                  {" "}
                  <CircularProgress color="inherit" />{" "}
                </td>
              </tr>
            </TableBody>
          ) : (
            <>
              {rows?.length > 0 ? (
                <TableBody>
                  {rows.map((row: any, index: number) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                        id={"row" + index}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format ? column.format(value) : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              ) : (
                <TableBody>
                  <tr>
                    <td colSpan={5} className="message">
                      Nenhum {entityName} encontrado.
                    </td>
                  </tr>
                </TableBody>
              )}
            </>
          )}
        </MuiTable>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={total}
        rowsPerPage={perPage}
        align="center"
        labelRowsPerPage="Itens por página:"
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={({ from, to, count }) => {
          return `${from}-${to} de ${count !== -1 ? count : `mais que ${to}`}`;
        }}
        showFirstButton
        showLastButton
      />
    </Paper>
  );
}
