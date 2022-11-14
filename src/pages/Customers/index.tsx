import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./styles.scss";

import { Button } from "@material-ui/core";
import {
  getCustomersList,
  ICustomerList,
} from "../../services/customers.service";
import {
  Add,
  ArrowDropUp,
  ArrowDropDown,
  VisibilityOutlined,
} from "@material-ui/icons";

import { CheckCircleOutline } from "@mui/icons-material";

import noImage from "../../assets/img/user-no-image.png";
import { cpfFormat } from "../../utils/stringFormat";
import { Table } from "../../components/Table";

import { Column, TypesIds } from "../../entities/TableFields";
import { ActionBar60x40 } from "../../components/ActionBar60x40";
import { SearchBar } from "../../components/SearchBar";

interface Data {
  actions: ReactNode;
  customerField: ReactNode;
  emailField: ReactNode;
  phoneField: string;
  cpfField: string;
  updatedAtField: string;
  id: string;
}

function createData(customer: ICustomerList): Data {
  const setDefaultSrc = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = noImage;
  };

  const {
    id,
    avatar,
    name,
    surname,
    email,
    validated_email,
    cpf,
    updated_at,
    phones,
  } = customer;

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
        onError={setDefaultSrc}
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

  return {
    actions,
    customerField,
    emailField,
    cpfField,
    updatedAtField,
    phoneField,
    id,
  };
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

  const columns: Column<TypesIds["customers"]>[] = [
    { id: "actions", label: "Ações", minWidth: 100 },
    {
      id: "customerField",
      label: "Usuário",
      minWidth: 300,
      width: "100%",
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
    <div id="user-list">
      <h2>Usuários</h2>

      <ActionBar60x40
        SearchBar={
          <SearchBar
            clearSearch={clearSearch}
            search={search}
            doSearch={doSearch}
            setSearch={setSearch}
          />
        }
        Button={
          <Button
            variant="contained"
            onClick={() => navigate("/usuarios/novo")}
          >
            <Add />
            Cadastrar
          </Button>
        }
      />

      <Table
        columns={columns}
        isLoading={isLoading}
        rows={rows}
        total={total}
        perPage={perPage}
        page={page}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}
