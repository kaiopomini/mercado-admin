import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./styles.scss";

import { toCurrency } from "../../../../utils/numberFormat";
import { NotifyTypesEnum, useApiNotify } from "../../../../hooks/apiNotify";
import {
  getProductListByCategory,
  IProductList,
} from "../../../../services/products.service";
import {
  Edit,
  Remove,
  Add,
  ArrowDropUp,
  ArrowDropDown,
} from "@material-ui/icons";

import noImage from "../../../../assets/img/default-no-image.png";
import { Table } from "../../../../components/Table";
import { Column, TypesIds } from "../../../../entities/TableFields";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import {
  addProductsToCategory,
  removeProductsFromCategory,
} from "../../../../services/categories.service";
import { SearchBar } from "../../../../components/SearchBar";

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

interface Props {
  categoryId: string;
}

export function ProductsList({ categoryId }: Props) {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Data[]>([]);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(10);
  const [sort, setSort] = useState("asc");
  const [hadSearch, setHadSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("own");

  const { addNotification } = useApiNotify();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, sort, filter]);

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
      categories,
    } = item;

    const showRemoveButton = categories?.some(
      (category) => category.id === categoryId
    );

    const actions = (
      <div className="product-edit">
        {showRemoveButton ? (
          <button
            className="remove-button"
            onClick={() => removeFromCategory(categoryId, [id], item.name)}
          >
            <Remove />
            Remover
          </button>
        ) : (
          <button
            className="add-button"
            onClick={() => addToCategory(categoryId, [id], item.name)}
          >
            <Add />
            Adicionar
          </button>
        )}
        <Link className="edit-button" to={"/produtos/" + id}>
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

  async function loadData(clear = false) {
    setIsLoading(true);
    const data = clear
      ? await getProductListByCategory({ categoryId, filter, perPage, sort })
      : await getProductListByCategory({
          categoryId,
          filter,
          search,
          page,
          perPage,
          sort,
        });

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

  const handleChangeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((event.target as HTMLInputElement).value);
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

  const addToCategory = async (
    category: string,
    productsIds: string[],
    productName: string
  ) => {
    const res = await addProductsToCategory(category, productsIds);
    if (res?.success) {
      addNotification(
        `${productName} foi adicionado na categoria`,
        NotifyTypesEnum.Success
      );
    } else {
      addNotification(
        `Não foi possível adicionar ${productName} na category.`,
        NotifyTypesEnum.Error
      );
    }
    loadData();
  };

  const removeFromCategory = async (
    category: string,
    productsIds: string[],
    productName: string
  ) => {
    const res = await removeProductsFromCategory(category, productsIds);
    if (res?.success) {
      addNotification(
        `${productName} foi removido da categoria`,
        NotifyTypesEnum.Success
      );
    } else {
      addNotification(
        `Não foi possível remover ${productName} da category.`,
        NotifyTypesEnum.Error
      );
    }
    loadData();
  };

  const columns: Column<TypesIds["products"]>[] = [
    { id: "actions", label: "Ações", minWidth: 210 },
    {
      id: "product",
      label: "Produto",
      minWidth: 300,
      width: "100%",
      icon: sort === "asc" ? <ArrowDropDown /> : <ArrowDropUp />,
      action: changeSort,
    },
    {
      id: "price",
      label: "Preço",
      minWidth: 100,
      format: (value: number) => toCurrency(value),
    },
    {
      id: "active",
      label: "Status",
      minWidth: 70,
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
    <div id="categoryProductList">
      <h2>Produtos</h2>

      <div className="action-bar">
        <SearchBar
          clearSearch={clearSearch}
          search={search}
          doSearch={doSearch}
          setSearch={setSearch}
        />
        <div>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={filter}
              onChange={handleChangeFilter}
            >
              <FormControlLabel
                value="own"
                control={<Radio />}
                label="Adicionados"
              />
              <FormControlLabel
                value="others"
                control={<Radio />}
                label="Não Vinculados"
              />
              <FormControlLabel value="all" control={<Radio />} label="Todos" />
            </RadioGroup>
          </FormControl>
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
