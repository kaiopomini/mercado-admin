import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import './styles.scss';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { toCurrency } from "../../utils/numberFormat";
import { Button } from "@material-ui/core";
import { getProductList } from "../../services/products";
import { Search, Close, Edit, Add, ArrowDropUp, ArrowDropDown } from "@material-ui/icons";

import noImage from '../../assets/img/product-no-image.png'
import { CircularProgress } from "@mui/material";

interface Column {
  id: 'actions' | 'product' | 'price' | 'active' | 'code';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
  action?: () => void;
  icon?: ReactNode;
}

interface Data {
  actions: ReactNode;
  product: ReactNode;
  price: number;
  active: string;
  code: string;
}

function createData(
  id: string,
  name: string,
  price: number,
  active: boolean,
  code: string,
  image: string,
): Data {

  const actions = (
    <div className="product-edit">
      <Link to={'/products/' + id}><Edit />Editar</Link>
    </div>
  );

  const product = (
    <div className="product-list-img">
      <img src={image && image !== 'default' ? image : noImage} alt={'imagem produto ' + name} />
      <p>{name}</p>
    </div>
  )

  const status = active ? 'Ativo' : 'Inativo';

  return { actions, product, price, active: status, code };
}

export function Products() {

  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([] as any);
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(10);
  const [sort, setSort] = useState('asc');
  const [hadSearch, setHadSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, sort])

  async function loadData(clear = false) {
    setIsLoading(true)
    const data = clear ? await getProductList(undefined, undefined, perPage, sort) : await getProductList(search, page, perPage, sort);
   
    if (data) {
      setTotal(data.total)
      setPage(data.page)
      setPerPage(data.per_page)

      const rowsRes = data && data.payload.map((item) => {
        return createData(item.id, item.name, item.price, item.active, item.gtin_code, item.image)
      })
      if (rowsRes) {
        setRows(rowsRes)

      }
    }
    setIsLoading(false)
    scrollToFirstRow()
  }

  const scrollToFirstRow = () => {
    const row = document.getElementById('row0');
    if (row) {
      row.scrollIntoView({ block: 'end', behavior: 'smooth' })
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setPerPage(+event.target.value)
    setPage(1);
  };

  const doSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHadSearch(true)
    if (page !== 1) {
      setPage(1)
    } else {
      loadData()
    }

  }
  const clearSearch = () => {

    if (hadSearch) {
      setHadSearch(false)
      setSearch('')
      if (page !== 1) {
        setPage(1)
      } else {
        loadData(true)
      }
    }
  }

  const changeSort = () => {
    sort === 'asc' ? setSort('desc') : setSort('asc');

  }

  const columns: readonly Column[] = [
    { id: 'actions', label: 'Ações', minWidth: 100 },
    { id: 'product', label: 'Produto', minWidth: 350, icon: sort === 'asc' ? <ArrowDropDown /> : <ArrowDropUp />, action: changeSort },
    {
      id: 'price',
      label: 'Preço',
      minWidth: 60,
      align: 'right',
      format: (value: number) => toCurrency(value),
    },
    {
      id: 'active',
      label: 'Status',
      minWidth: 60,
      align: 'right',
    },
    {
      id: 'code',
      label: 'Código de barras',
      minWidth: 150,
      align: 'right',
      format: (value: number) => value.toFixed(2),
    },
  ];

  return (
    <div className="productList">
      <h2>Produtos</h2>
      <div className="action-bar">
        <div className="search-bar">
          <form onSubmit={doSearch} className="search" >
            <input type="text" autoFocus placeholder='Buscar...' value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="clear-btn" type="button" onClick={clearSearch}><Close /></button>
            <button className="search-btn" type="submit"><Search /></button>
          </form>
          <div className="select-filter">
          </div>
        </div>
        <div className="new-product">
          <Button variant="contained" onClick={() => navigate('/products/new')}><Add />Cadastrar</Button>
        </div>
      </div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }} >
        <TableContainer sx={{ height: '54vh' }} className="table">
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    onClick={column.action}
                    sortDirection={'asc'}
                  >
                    <div className={'table-title' + (column.action && ' action')}>
                      {column.label}
                      {column.icon && column.icon}
                    </div>

                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {isLoading? <TableBody><tr><td colSpan={5} className="loading"><CircularProgress color="inherit"/></td></tr></TableBody>
              :
              <TableBody>
                {rows
                  .map((row: any, index: number) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.code} id={'row' + index}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>

            }

          </Table>
        </TableContainer>
        <TablePagination

          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={total}
          rowsPerPage={perPage}
          align="center"
          labelRowsPerPage="Produtos por página:"
          page={page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) => {
            return `${from}-${to} de ${count !== -1 ? count : `more than ${to}`}`;
          }}
          showFirstButton
          showLastButton
        />
      </Paper>
    </div>
  );
}