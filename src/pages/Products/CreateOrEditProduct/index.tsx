import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Edit, ArrowBack } from "@material-ui/icons";

import { CurrencyInput } from "../../../components/CurrencyInput";
import { UploadProductsImages } from "../../../components/inputs/UploadProductsImages";
import {
  createProduct,
  deleteProduct,
  getProduct,
  IProductPost,
  updateProduct,
} from "../../../services/products";

import "./styles.scss";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { NotifyTypesEnum, useApiNotify } from "../../../hooks/apiNotify";
export interface IIndexable {
  [key: string]: any;
}

export function CreateOrEditProduct() {
  const schema = Yup.object().shape({
    barCode: Yup.string().required("Codigo de barras é obrigatório"),
    name: Yup.string()
      .required("Nome é obrigatório")
      .max(100, "Máximo de 100 caracteres"),
    price: Yup.number()
      .typeError("Informe um valor númerico")
      .positive("O valor não pode ser negativo")
      .required("Preço é obrigatório"),
    basePrice: Yup.number()
      .typeError("Informe um valor númerico")
      .positive("O valor não pode ser negativo")
      .required("Preço de custo é obrigatório"),
    description: Yup.string().nullable().max(255, "Máximo de 255 caracteres"),
    active: Yup.boolean().default(false).required("Ativo é obrigatório"),
    controlledInventory: Yup.boolean()
      .default(false)
      .required("Ativo é obrigatório"),
    quantity: Yup.number()
      .default(0)
      .integer("Informe um valor inteiro")
      .typeError("Informe um valor númerico")
      .positive("A quantidade não pode ser negativa")
      .min(0, "A quantidade não pode ser negativa"),
    quantityType: Yup.string().required("Unidade é obrigatório"),
    image: Yup.string().default("").nullable(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    clearErrors,
    trigger,
  } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editBarCode, setEditBarCode] = useState(false);
  const [clicked, setClicked] = useState("");
  const [data, setData] = useState<IProductPost>();
  const [newProductId, setNewProductId] = useState('');
  const { productId } = useParams();

  const navigate = useNavigate();
  const { addNotification } = useApiNotify();

  async function onSubmit(data: any) {
    setIsLoading(true);
    setClicked("save");

    if (editMode && (productId || newProductId)) {
      console.log(newProductId)
      const id = newProductId ? newProductId : productId;
      const response = await updateProduct({ ...data, id });
      if (response?.success) {
        addNotification(response.message, NotifyTypesEnum.Success);
      } else {
        addNotification(
          response?.message ||
            "Não foi possível salvar as alterações feitas no produto.",
          NotifyTypesEnum.Error
        );
      }
    } else {
      const response = await createProduct(data);
      if (response?.success) {
        addNotification(response.message, NotifyTypesEnum.Success);
        response.payload?.id && setNewProductId(response.payload.id)
        setEditMode(true);
        // navigate("/produtos");
      } else {
        addNotification(
          response?.message || "Não foi possível criar o produto.",
          NotifyTypesEnum.Error
        );
      }
    }

    setIsLoading(false);
  }

  async function handleDelete() {
    setClicked("delete");
    setIsLoading(true);
    if (productId) {
      const response = await deleteProduct(productId);

      if (response?.success) {
        addNotification(response.message, NotifyTypesEnum.Success);
        navigate("/produtos");
      } else {
        addNotification(
          response?.message || "Não foi possível excluir o produto.",
          NotifyTypesEnum.Error
        );
      }
    }
    setIsLoading(false);
  }

  function handleBack() {
    navigate(-1);
  }

  useEffect(() => {
    if (productId) {
      loadData();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setImageUrl(url: string): void {
    setValue("image", url);
  }

  async function loadData() {
    setIsLoading(true);
    if (productId) {
      const data = await getProduct(productId);
      const product = data?.payload;
      if (product) {
        const {
          active,
          description,
          gtin_code,
          id,
          name,
          price,
          base_price,
          image,
          controlled_inventory,
          quantity,
          quantity_type
        } = product;
        const data = {
          id,
          description,
          barCode: gtin_code,
          name,
          price,
          active,
          basePrice: base_price,
          image,
          controlledInventory: controlled_inventory,
          quantity,
          quantityType: quantity_type
        };

        setData(data);

        Object.keys(data).forEach((field) => {
          setValue(field, (data as IIndexable)[field]);
        });

        setEditMode(true);
      }
    }
    setIsLoading(false);
  }

  return (
    <div id="new-product">
      <h2>{editMode && data?.name ? data.name : "Novo Produto"}</h2>
      <div className="form-container">
        {isLoading && !clicked ? (
          <div className="loading">
            {" "}
            <CircularProgress />{" "}
          </div>
        ) : (
          <form onSubmit={e => e.preventDefault()} onReset={reset}>
            <div className="top-content">
              <div className="main-input-container">
                <div className="line-input">
                  <Controller
                    name="barCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        label="Código de barras"
                        fullWidth
                        autoFocus={!editMode}
                        autoComplete="off"
                        error={!!errors.barCode}
                        helperText={errors.barCode?.message || " "}
                        disabled={editMode && !editBarCode}
                        {...field}
                      />
                    )}
                  />

                  {editMode && !editBarCode && (
                    <button
                      className={editBarCode ? "edit red" : "edit"}
                      onClick={() => setEditBarCode(!editBarCode)}
                      type="button"
                    >
                      {" "}
                      <Edit />{" "}
                    </button>
                  )}
                </div>

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
                  <CurrencyInput
                    label="Preço"
                    id="price"
                    autoComplete="off"
                    fullWidth={true}
                    onChangeInput={(value) => {
                      setValue("price", value ? parseFloat(value) : undefined);
                    }}
                    currentValue={watch("price")}
                    error={!!errors.price}
                    helperText={errors.price?.message || " "}
                    onFocus={() => clearErrors("price")}
                    onBlur={() => trigger("price")}
                  />
                </div>
                <div className="line-input">
                  <CurrencyInput
                    label="Preço de custo"
                    id="basePrice"
                    autoComplete="off"
                    fullWidth={true}
                    onChangeInput={(value) => {
                      setValue(
                        "basePrice",
                        value ? parseFloat(value) : undefined
                      );
                    }}
                    currentValue={watch("basePrice")}
                    error={!!errors.basePrice}
                    helperText={errors.basePrice?.message || " "}
                    onFocus={() => clearErrors("basePrice")}
                    onBlur={() => trigger("basePrice")}
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
              </div>
              <div className="upload-image-container">
                <UploadProductsImages
                  setValue={setImageUrl}
                  imageUrl={watch("image")}
                />
              </div>
            </div>

            <div className="bottom-content">
              <div className="line-input quantity-container">
                <Controller
                  name="quantity"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      size="small"
                      label="Quantidade"
                      type={"number"}
                      autoComplete="off"
                      error={!!errors.quantity}
                      helperText={errors.quantity?.message || " "}
                      {...field}
                    />
                  )}
                />
                <FormControl size="small" error={errors.quantityType } sx={{ m: 0, minWidth: 120 }}>
                  <InputLabel id="select-input" > Unidade</InputLabel>
                  <Controller
                    
                    name="quantityType"
                    control={control}
                    render={({ field, fieldState}) => (
                      <>
                        <Select
                          labelId="select-input"
                          size="small"
                          value={field.value}
                          label="Unidade"
                          error={!!errors.quantityType}
                          onChange={(e) => setValue(field.name, e.target.value)}
                        >
                          <MenuItem value={undefined}>
                            <em>Selecione</em>
                          </MenuItem>
                          <MenuItem value={'kg'}>Kilos (Kg)</MenuItem>
                          <MenuItem value={'un'}>Unidade (Un)</MenuItem>
                        </Select>
                        <FormHelperText>{errors.quantityType?.message || " "}</FormHelperText>
                      </>
                    )}
                  />
                  
                </FormControl>

                <FormControlLabel
                  control={
                    <Controller
                      name="controlledInventory"
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
                  label="Controle de estoque"
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
                  label="Produto ativo"
                />
              </div>
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
                {editMode && (
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
                )}
                <Button variant="contained" disabled={isLoading} onClick={handleSubmit(onSubmit)}>
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
