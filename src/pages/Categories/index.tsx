import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./styles.scss";

import { Button } from "@material-ui/core";
import {
  getCategoryList,
  ICategoryList,
} from "../../services/categories.service";
import {
  Search,
  Close,
  Edit,
  Add,
  ArrowDropUp,
  ArrowDropDown,
} from "@material-ui/icons";

import noImage from "../../assets/img/category-no-image.png";
import { Table } from "../../components/Table";
import { Column, TypesIds } from "../../entities/TableFields";

interface Data {
  actions: ReactNode;
  category: ReactNode;
  active: string;
  id: string;
}

function createData(item: ICategoryList): Data {
  const setDefaultSrc = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = noImage;
  };

  const { id, image, name, active } = item;

  const actions = (
    <div className="category-edit">
      <Link to={"/categorias/" + id}>
        <Edit />
        Editar
      </Link>
    </div>
  );

  const category = (
    <div className="category-list-img">
      <img
        src={image && image !== "default" ? image : noImage}
        alt={"imagem da categoria " + name}
        onError={setDefaultSrc}
      />
      <p>{name}</p>
    </div>
  );

  const status = active ? "Ativo" : "Inativo";

  return {
    actions,
    category,
    active: status,
    id,
  };
}

export function Categories() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Data[]>([]);
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
      ? await getCategoryList(undefined, undefined, perPage, sort)
      : await getCategoryList(search, page, perPage, sort);

    if (data) {
      setTotal(data.total);
      setPage(data.page);
      setPerPage(data.per_page);

      const rowsRes =
        data &&
        data.payload.map((item) => {
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

  const columns: Column<TypesIds["categories"]>[] = [
    { id: "actions", label: "Ações", minWidth: 100 },
    {
      id: "category",
      label: "Categoria",
      minWidth: 350,
      icon: sort === "asc" ? <ArrowDropDown /> : <ArrowDropUp />,
      action: changeSort,
    },
    {
      id: "active",
      label: "Status",
      minWidth: 60,
    },
  ];

  return (
    <div id="categoryList">
      <h2>Categorias</h2>
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
        <div className="new-category">
          <Button
            variant="contained"
            onClick={() => navigate("/categorias/novo")}
          >
            <Add />
            Cadastrar
          </Button>
        </div>
      </div>

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
