import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./styles.scss";

import { Button } from "@material-ui/core";
import {
  getCategoryList,
  ICategoryList,
} from "../../services/categories.service";
import {
  Edit,
  Add,
  ArrowDropUp,
  ArrowDropDown,
  Remove,
} from "@material-ui/icons";

import noImage from "../../assets/img/category-no-image.png";
import vegetables from "../../assets/img/vegetables.jpg";
import smartphoneWire from "../../assets/img/phone-screen.png";

import { Table } from "../../components/Table";
import { OrderableTableHighlights } from "./OrderableTableHighlights.component";
import { Column, TypesIds } from "../../entities/TableFields";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { SearchBar } from "../../components/SearchBar";
import { ActionBar60x40 } from "../../components/ActionBar60x40";

interface Data {
  actions: ReactNode;
  category: ReactNode;
  active: string;
  id: string;
}

const styleModal = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,

  p: 4,
};

function createData(item: ICategoryList): Data {
  const setDefaultSrc = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = noImage;
  };

  const { id, image, name, active } = item;

  const actions = (
    <div className="category-edit" style={{ width: "100%" }}>
      <button
        className="remove-button"
        // onClick={() => removeFromCategory(categoryId, [id], item.name)}
      >
        <Remove />
        Remover
      </button>
      <Link className="edit-button" to={"/categorias/" + id}>
        <Edit />
        Editar
      </Link>
    </div>
  );

  const category = (
    <div className="category-list-img" style={{ minWidth: "100%", flex: 1 }}>
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

function createDataOrderableTable(item: ICategoryList): Data {
  const setDefaultSrc = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = noImage;
  };

  const { id, image, name, active } = item;

  const actions = (
    <div className="category-edit" style={{ width: "100%" }}>
      <button
        className="remove-button"
        // onClick={() => removeFromCategory(categoryId, [id], item.name)}
      >
        <Remove />
        Remover
      </button>
      <Link className="edit-button" to={"/categorias/" + id}>
        <Edit />
        Editar
      </Link>
    </div>
  );

  const category = (
    <div className="category-list-img" style={{ minWidth: "100%", flex: 1 }}>
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

export function Highlights() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Data[]>([]);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(10);
  const [sort, setSort] = useState("asc");
  const [hadSearch, setHadSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

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
  }

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
      width: "100%",
      icon: sort === "asc" ? <ArrowDropDown /> : <ArrowDropUp />,
      action: changeSort,
    },
    {
      id: "active",
      label: "Status",
      minWidth: 60,
    },
  ];

  const columnsOrdeable: Column<TypesIds["categories"]>[] = [
    { id: "actions", label: "Ações", minWidth: 200 },
    {
      id: "category",
      label: "Categoria",
      minWidth: 350,
      width: "100%",
    },
    {
      id: "active",
      label: "Status",
      minWidth: 60,
    },
  ];

  return (
    <div id="highlights">
      <h2>Destaques</h2>
      <div className="container">
        <div className="tables-container">
          <OrderableTableHighlights />
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
                onClick={() => navigate("/app/destaques/novo")}
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
        <div className="preview-container">
          <div className="aspect-ratio-wrapper">
            <div className="smartphone-wrapper">
              <img src={smartphoneWire} alt="" />
            </div>
            <div className="content-wrapped">
              <img src={vegetables} alt="" />
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleCloseModal}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="xl"
        fullWidth
        id="highlightModal"
      >
        <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>
        <DialogContent dividers>
          <OrderableTableHighlights />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleCloseModal}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
