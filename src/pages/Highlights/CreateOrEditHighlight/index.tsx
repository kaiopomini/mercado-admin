import {
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowBack } from "@material-ui/icons";

import { UploadImages } from "../../../components/inputs/UploadImages";

import "./styles.scss";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { NotifyTypesEnum, useApiNotify } from "../../../hooks/apiNotify";
import {
  createCategory,
  deleteCategory,
  getCategory,
  ICategoryPost,
  updateCategory,
} from "../../../services/categories.service";
import { HighlightsList } from "./HighlightsList";
export interface IIndexable {
  [key: string]: any;
}

export function CreateOrEditHighlight() {
  const schema = Yup.object().shape({
    name: Yup.string()
      .required("Nome é obrigatório")
      .max(100, "Máximo de 100 caracteres"),
    description: Yup.string().nullable().max(255, "Máximo de 255 caracteres"),
    active: Yup.boolean().default(false).required("Ativo é obrigatório"),
    image: Yup.string().default("").nullable(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [clicked, setClicked] = useState("");
  const [data, setData] = useState<ICategoryPost>();
  const [categoryId, setCategoryId] = useState("");
  const params = useParams();

  const navigate = useNavigate();
  const { addNotification } = useApiNotify();

  async function onSubmit(data: any) {
    setIsLoading(true);
    setClicked("save");

    if (editMode && categoryId) {
      const response = await updateCategory({ ...data, categoryId });
      if (response?.success) {
        addNotification(response.message, NotifyTypesEnum.Success);
      } else {
        addNotification(
          response?.message ||
            "Não foi possível salvar as alterações feitas na categoria.",
          NotifyTypesEnum.Error
        );
      }
    } else {
      const response = await createCategory(data);
      if (response?.success) {
        addNotification(response.message, NotifyTypesEnum.Success);
        response.payload?.id && setCategoryId(response.payload.id);
        setEditMode(true);
      } else {
        addNotification(
          response?.message || "Não foi possível criar a categoria.",
          NotifyTypesEnum.Error
        );
      }
    }

    setIsLoading(false);
  }

  async function handleDelete() {
    setClicked("delete");
    setIsLoading(true);
    if (categoryId) {
      const response = await deleteCategory(categoryId);

      if (response?.success) {
        addNotification(response.message, NotifyTypesEnum.Success);
        navigate("/categorias");
      } else {
        addNotification(
          response?.message || "Não foi possível excluir a categoria.",
          NotifyTypesEnum.Error
        );
      }
    }
    setIsLoading(false);
  }

  function handleBack() {
    navigate(-1);
  }

  function handleShowProducts() {
    setShowProducts((value) => !value);
  }

  useEffect(() => {
    if (params.categoryId) {
      setCategoryId(params.categoryId);
      loadData(params.categoryId);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setImageUrl(url: string): void {
    setValue("image", url);
  }

  async function loadData(categoryId: string) {
    setIsLoading(true);

    const data = await getCategory(categoryId);
    const category = data?.payload;
    if (category) {
      setData(category);

      Object.keys(category).forEach((field) => {
        setValue(field, (category as IIndexable)[field]);
      });

      setEditMode(true);
    }

    setIsLoading(false);
  }

  return (
    <div id="new-category">
      <h2>{editMode && data?.name ? data.name : "Nova Categoria"}</h2>
      <div className="form-container">
        {isLoading && !clicked ? (
          <div className="loading">
            {" "}
            <CircularProgress />{" "}
          </div>
        ) : (
          <form onSubmit={(e) => e.preventDefault()} onReset={reset}>
            <div className="top-content">
              <div className="main-input-container">
                <div className="line-input">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        label="Nome"
                        fullWidth
                        autoComplete="off"
                        error={!!errors.name}
                        helperText={errors.name?.message || " "}
                        {...field}
                      />
                    )}
                  />
                </div>

                <div className="line-input">
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        label="Descrição (opcional)"
                        fullWidth
                        multiline={true}
                        minRows={3}
                        maxRows={3}
                        autoComplete="off"
                        error={errors.description?.message}
                        helperText={errors.description?.message || " "}
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="line-input">
                  <FormControlLabel
                    control={
                      <Controller
                        name="active"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            {...field}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        )}
                      />
                    }
                    label="Categoria ativa"
                  />

                  {editMode ? (
                    <div>
                      <Button
                        variant="contained"
                        disabled={isLoading}
                        onClick={handleShowProducts}
                      >
                        {showProducts ? "Esconder Produtos" : "Ver Produtos"}
                      </Button>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="upload-image-container">
                <UploadImages
                  setValue={setImageUrl}
                  imageUrl={watch("image")}
                  type={"products-categories"}
                />
              </div>
            </div>

            <div className="bottom-content">
              {categoryId && showProducts ? (
                <HighlightsList categoryId={categoryId} />
              ) : (
                <></>
              )}
            </div>
            <div className="actions-container">
              <Button
                startIcon={<ArrowBack />}
                variant="outlined"
                onClick={handleBack}
              >
                voltar
              </Button>
              <div>
                {editMode ? (
                  <Button
                    variant="outlined"
                    onClick={handleDelete}
                    color="error"
                    disabled={isLoading}
                    className="delete-button"
                  >
                    {isLoading && clicked === "delete" ? (
                      <CircularProgress color="inherit" size={16} />
                    ) : (
                      "excluir"
                    )}
                  </Button>
                ) : (
                  <></>
                )}
                <Button
                  variant="contained"
                  disabled={isLoading}
                  onClick={handleSubmit(onSubmit)}
                >
                  {isLoading && clicked === "save" ? (
                    <CircularProgress color="inherit" size={16} />
                  ) : (
                    "salvar"
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
