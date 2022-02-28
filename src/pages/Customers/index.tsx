import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./styles.scss";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Button } from "@material-ui/core";
import { getCustomersList, ICustomerList } from "../../services/customers";
import {
  Search,
  Close,
  Add,
  ArrowDropUp,
  ArrowDropDown,
  VisibilityOutlined
} from "@material-ui/icons";

import { CheckCircleOutline } from "@mui/icons-material";

import noImage from "../../assets/img/user-no-image.png";
import { CircularProgress } from "@mui/material";
import { cpfFormat } from "../../utils/stringFormat";

interface Column {
  id:
    | "actions"
    | "customerField"
    | "emailField"
    | "cpfField"
    | "phoneField"
    | "updatedAtField";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: any) => string;
  action?: () => void;
  icon?: ReactNode;
}

interface Data {
  actions: ReactNode;
  customerField: ReactNode;
  emailField: ReactNode;
  phoneField: string;
  cpfField: string;
  updatedAtField: string;
}

function createData(customer: ICustomerList): Data {
  const { id, avatar, name, surname, email, validated_email, cpf, updated_at, phones } =
    customer;

  const actions = (
    <div className="customer-edit">
      <Link to={"/usuarios/" + id}>
        <VisibilityOutlined />
        Visualizar
      </Link>
    </div>
  );

  const customerField = (
    <div className="customer-list-img">
      <img
        src={avatar && avatar !== "default" ? avatar : noImage}
        alt={"imagem avatar usuário" + name}
      />
      <p>{`${name} ${surname}`}</p>
    </div>
  );

  const emailField = (
    <div className="customer-email">
      <p>{email}</p>
      {validated_email && <CheckCircleOutline />}
    </div>
  );

  const cpfField = cpf || "-";

  const phoneField = phones[0]?.phone_number || "-";

  const updatedAtField = new Date(updated_at).toDateString() || "-";

  return { actions, customerField, emailField, cpfField, updatedAtField, phoneField };
}

export function Customers() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([] as any);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(10);
  const [sort, setSort] = useState("asc");
  const [hadSearch, setHadSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, sort]);

  async function loadData(clear = false) {
    setIsLoading(true);
    const data = clear
      ? await getCustomersList(undefined, undefined, perPage, sort)
      : await getCustomersList(search, page, perPage, sort);

    if (data) {
      setTotal(data.total);
      setPage(data.page);
      setPerPage(data.per_page);

      const rowsRes =
        data &&
        data.payload.map((item: ICustomerList) => {
          return createData(item);
        });
      if (rowsRes) {
        setRows(rowsRes);
      }
    }
    setIsLoading(false);
    scrollToFirstRow();
  }

  const scrollToFirstRow = () => {
    const row = document.getElementById("row0");
    if (row) {
      row.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPerPage(+event.target.value);
    setPage(1);
  };

  const doSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHadSearch(true);
    if (page !== 1) {
      setPage(1);
    } else {
      loadData();
    }
  };
  const clearSearch = () => {
    if (hadSearch) {
      setHadSearch(false);
      setSearch("");
      if (page !== 1) {
        setPage(1);
      } else {
        loadData(true);
      }
    } else {
      setSearch("");
    }
  };

  const changeSort = () => {
    sort === "asc" ? setSort("desc") : setSort("asc");
  };

  const columns: readonly Column[] = [
    { id: "actions", label: "Ações", minWidth: 100 },
    {
      id: "customerField",
      label: "Usuário",
      minWidth: 300,
      icon: sort === "asc" ? <ArrowDropDown /> : <ArrowDropUp />,
      action: changeSort,
    },
    {
      id: "emailField",
      label: "Email",
      minWidth: 200,
    },
    {
      id: "phoneField",
      label: "Telefone",
      minWidth: 200,
    },
    {
      id: "cpfField",
      label: "Cpf",
      minWidth: 140,
      format: (value: string) => cpfFormat(value),
    },
  ];

  return (
    <div id="userList">
      <h2>Usuários</h2>
      <div className="action-bar">
        <div className="search-bar">
          <form onSubmit={doSearch} className="search">
            <input
              type="text"
              autoFocus
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="clear-btn" type="button" onClick={clearSearch}>
              <Close />
            </button>
            <button className="search-btn" type="submit">
              <Search />
            </button>
          </form>
          <div className="select-filter"></div>
        </div>
        <div className="new-customer">
          <Button
            variant="contained"
            onClick={() => navigate("/usuarios/novo")}
          >
            <Add />
            Cadastrar
          </Button>
        </div>
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ height: "54vh" }} className="table">
          <Table stickyHeader aria-label="sticky table">
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
                    <div
                      className={"table-title" + (column.action && " action")}
                    >
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
                  <td colSpan={5} className="loading">
                    <CircularProgress color="inherit" />
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
                          key={row.code}
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
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  </TableBody>
                )}
              </>
            )}
          </Table>
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
            return `${from}-${to} de ${
              count !== -1 ? count : `mais que ${to}`
            }`;
          }}
          showFirstButton
          showLastButton
        />
      </Paper>
    </div>
  );
}
