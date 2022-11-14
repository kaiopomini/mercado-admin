import { Edit, Remove } from "@material-ui/icons";
import {
  Paper,
  TableContainer,
  Table as MuiTable,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import React, { ReactNode, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Column, TypesIds } from "../../../entities/TableFields";
import {
  getCategoryList,
  ICategoryList,
} from "../../../services/categories.service";

import noImage from "../../../assets/img/default-no-image.png";

import "./styles.scss";
import { Link } from "react-router-dom";

interface Props {
  columns: Column<
    TypesIds["categories"] | TypesIds["customers"] | TypesIds["products"]
  >[];
  isLoading: boolean;
  rows: any[];
  highlights: any[];
  total: number;
  perPage: number;
  page: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  entityName?: string;
  isDragDisabled: boolean;
}

interface Data {
  actions: ReactNode;
  category: ReactNode;
  active: string;
  id: string;
}

const reOrder = (list: any, startIndex: any, endIndex: any) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  console.log("result", result);

  return result;
};

function HighlightList({ highlights, columns }: any) {
  return highlights.map((highlight: any, index: number) => (
    <Highlight
      highlight={highlight}
      index={index}
      key={highlight.id}
      columns={columns}
    />
  ));
}

function Highlight({ highlight, index, columns, isDragDisabled }: any) {
  return (
    <Draggable
      isDragDisabled={isDragDisabled}
      draggableId={highlight.id}
      index={index}
    >
      {(provided) => (
        <TableRow
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          hover
          role="checkbox"
          tabIndex={-1}
          key={highlight.id}
          id={"row" + index}
        >
          {columns.map((column: any) => {
            const value = highlight[column.id];
            return (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth, width: column.width }}
              >
                {column.format ? column.format(value) : value}
              </TableCell>
            );
          })}
        </TableRow>
      )}
    </Draggable>
  );
}

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

export function OrderableTableHighlights() {
  const [state, setState] = useState<any>({});

  /////////////////////

  const [rows, setRows] = useState<Data[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    setIsLoading(true);
    const data = await getCategoryList(undefined, undefined, 100);

    if (data) {
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
  const columns: Column<TypesIds["categories"]>[] = [
    { id: "actions", label: "Ações", minWidth: 100 },
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

  /////////////////////

  function onDragEnd(result: any) {
    console.log("result enter", result);
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    console.log("state", state);

    const reorderedRows = reOrder(
      state.rows,
      result.source.index,
      result.destination.index
    );

    setState({ rows: reorderedRows });
  }
  useEffect(() => {
    setState({ rows });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);
  return (
    <Paper id="orderableTableHighlights">
      <TableContainer className="paper-table">
        <MuiTable stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, width: column.width }}
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
              {state.rows?.length > 0 ? (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="list">
                    {(provided) => (
                      <TableBody
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <HighlightList
                          highlights={state.rows}
                          columns={columns}
                          isDragDisabled={true}
                          className={"drag"}
                        />

                        {provided.placeholder}
                      </TableBody>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <TableBody>
                  <tr>
                    <td colSpan={5} className="message">
                      Nenhum {"item"} encontrado.
                    </td>
                  </tr>
                </TableBody>
              )}
            </>
          )}
        </MuiTable>
      </TableContainer>
    </Paper>
  );
}
