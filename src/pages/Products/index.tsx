import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./styles.scss";

import { toCurrency } from "../../utils/numberFormat";
import { Button } from "@material-ui/core";
import { getProductList, IProductList } from "../../services/products.service";
import { Edit, Add, ArrowDropUp, ArrowDropDown } from "@material-ui/icons";

import noImage from "../../assets/img/product-no-image.png";
import { Table } from "../../components/Table";
import { Column, TypesIds } from "../../entities/TableFields";
import { ActionBar60x40 } from "../../components/ActionBar60x40";
import { SearchBar } from "../../components/SearchBar";

interface Data {
  actions: ReactNode;
  product: ReactNode;
  price: number;
  active: string;
  code: string;
  quantity: number;
  inventoryControl: string;
  id: string;
}

function createData(item: IProductList): Data {
  const setDefaultSrc = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = noImage;
  };

  const {
    id,
    image,
    name,
    active,
    quantity,
    controlled_inventory,
    price,
    gtin_code,
  } = item;

  const actions = (
    <div className="product-edit">
      <Link to={"/produtos/" + id}>
        <Edit />
        Editar
      </Link>
    </div>
  );

  const product = (
    <div className="product-list-img">
      <img
        src={image && image !== "default" ? image : noImage}
        alt={"imagem produto " + name}
        onError={setDefaultSrc}
      />
      <p>{name}</p>
    </div>
  );

  const status = active ? "Ativo" : "Inativo";

  const inventoryControl = controlled_inventory ? "Ativo" : "Inativo";

  return {
    actions,
    product,
    price,
    active: status,
    code: gtin_code,
    quantity,
    inventoryControl,
    id,
  };
}

export function Products() {
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
      ? await getProductList({ perPage, sort })
      : await getProductList({ search, page, perPage, sort });

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

  const columns: Column<TypesIds["products"]>[] = [
    { id: "actions", label: "Ações", minWidth: 100 },
    {
      id: "product",
      label: "Produto",
      minWidth: 350,
      width: "100%",
      icon: sort === "asc" ? <ArrowDropDown /> : <ArrowDropUp />,
      action: changeSort,
    },
    {
      id: "price",
      label: "Preço",
      minWidth: 60,
      format: (value: number) => toCurrency(value),
    },
    {
      id: "active",
      label: "Status",
      minWidth: 60,
    },
    {
      id: "inventoryControl",
      label: "Estoque",
      minWidth: 60,
    },
    {
      id: "quantity",
      label: "Quantidade",
      minWidth: 60,
    },
    {
      id: "code",
      label: "Código de barras",
      minWidth: 150,
      align: "right",
    },
  ];

  return (
    <div id="productList">
      <h2>Produtos</h2>
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
            onClick={() => navigate("/produtos/novo")}
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
