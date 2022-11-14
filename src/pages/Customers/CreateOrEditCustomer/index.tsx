import { Button, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowBack, Delete } from "@material-ui/icons";

import {
  createCustomer,
  getCustomer,
  ICustomerList,
  ICustomerPost,
} from "../../../services/customers.service";

import "./styles.scss";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { NotifyTypesEnum, useApiNotify } from "../../../hooks/apiNotify";
import { validadeCPF } from "../../../utils/validations";
import { UploadUsersImages } from "../../../components/inputs/UploadUsersImages";
import { Add } from "@mui/icons-material";

export interface IIndexable {
  [key: string]: any;
}

export function CreateOrEditCustomers() {
  const schema = Yup.object().shape({
    surname: Yup.string()
      .required("Sobrenome é obrigatório")
      .max(100, "Máximo de 100 caracteres"),
    name: Yup.string()
      .required("Nome é obrigatório")
      .max(100, "Máximo de 100 caracteres"),
    email: Yup.string()
      .required("Email é obrigatório")
      .email("Informe um email válido"),
    password: Yup.string()
      .required("Senha é obrigatória")
      .matches(/^[^\s]+(\S+[^\s]+)*$/, "A senha não deve conter espaços")
      .matches(/[A-Z]/, "A senha deve ter pelomenos 1 letra maiúscula")
      .matches(/[a-z]/, "A senha deve ter pelomenos 1 letra minúscula")
      .matches(/[0-9]/, "A senha deve ter pelomenos 1 número")
      .min(8, "A senha deve ter pelomenos 8 caracteres"),
    cpf: Yup.string()
      .default(null)
      .notRequired()
      .nullable()
      .test("is-cpf", "CFP inválido", (value) => {
        if (value) {
          return validadeCPF(value);
        }
        return true;
      }),
    birthDate: Yup.date()
      .notRequired()
      .nullable()
      .typeError("Data inválida")
      .min(new Date(1900, 0, 1), "Data inválida")
      .max(new Date(), "Data inválida"),
    avatar: Yup.string().nullable(),
    phones: Yup.array().of(
      Yup.object().shape({
        phone_number: Yup.string().required("Telefone/Whatsapp é obrigatório"),
      })
    ),
    address: Yup.object({
      name: Yup.string().required("Endereço é obrigatório"),
      number: Yup.string().notRequired(),
      zip_code: Yup.string().required("CEP é obrigatório"),
      city: Yup.string().required("Cidade é obrigatório"),
      federative_unity: Yup.string().required("Estado é obrigatório"),
    }).required("required"),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    resetField,
    getValues,
    clearErrors,
  } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const [arrControllerPhones, setArrControllerPhones] = useState([0]);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [clicked, setClicked] = useState("");
  const [data, setData] = useState<ICustomerPost>();
  const { userId } = useParams();

  const navigate = useNavigate();
  const { addNotification } = useApiNotify();

  async function onSubmit(data: any, e: any) {
    e.preventDefault();
    setIsLoading(true);
    setClicked("save");

    if (editMode && userId) {
      // const response = await updateCustomer({ ...data, id: userId });
      const response = { success: false, message: "" };
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
      const response = await createCustomer(data);
      if (response?.success) {
        addNotification(response.message, NotifyTypesEnum.Success);
        setEditMode(false);
      } else {
        addNotification(
          response?.message || "Não foi possível criar o usuário.",
          NotifyTypesEnum.Error
        );
      }
    }

    setIsLoading(false);
  }

  // async function handleDelete() {
  //   setClicked("delete");
  //   setIsLoading(true);
  //   if (userId) {
  //     const response = await deleteCustomer(userId);

  //     if (response?.success) {
  //       addNotification(response.message, NotifyTypesEnum.Success);
  //       navigate("/produtos");
  //     } else {
  //       addNotification(
  //         response?.message || "Não foi possível excluir o produto.",
  //         NotifyTypesEnum.Error
  //       );
  //     }
  //   }
  //   setIsLoading(false);
  // }

  function handleBack() {
    navigate(-1);
  }

  useEffect(() => {
    if (userId) {
      loadData();
    } else {
      setEditMode(true);
      setIsLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setImageUrl(url: string): void {
    setValue("avatar", url);
  }

  async function loadData() {
    setIsLoading(true);
    if (userId) {
      const data = await getCustomer(userId);
      const customer = data?.payload;
      if (customer) {
        populateData(customer);
      }
    }
    setIsLoading(false);
  }

  const populateData = async (customer: ICustomerList) => {
    const {
      name,
      addresses,
      avatar,
      email,
      id,
      phones,
      surname,
      birth_date,
      cpf,
    } = customer;
    const data = {
      name,
      address: addresses[0],
      avatar,
      email,
      id,
      phones,
      surname,
      birthDate: birth_date,
      cpf,
    };

    setArrControllerPhones(phones.map((item, index) => index));

    setData(data);

    Object.keys(data).forEach((field) => {
      setValue(field, (data as IIndexable)[field]);
    });
  };

  const handleAddPhone = () => {
    const oldArr = [...arrControllerPhones];
    oldArr.push(0);
    setArrControllerPhones(oldArr);
  };

  const handleDeletePhone = (index: number) => {
    const phonesArr = getValues("phones");
    resetField(`phones[${index}]`);
    clearErrors(`phones[${index}]`);
    phonesArr.splice(index, 1);
    setValue("phones", phonesArr, { shouldDirty: true });
    const oldArr = [...arrControllerPhones];
    oldArr.pop();
    setArrControllerPhones(oldArr);
  };

  return (
    <div id="newUser">
      <h2>{editMode && !data?.name ? "Novo Cliente" : data?.name}</h2>
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
                    render={({ field, fieldState }) => (
                      <TextField
                        size="small"
                        label="Nome"
                        fullWidth
                        autoFocus={editMode}
                        autoComplete="off"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || " "}
                        {...field}
                        inputProps={{ disabled: !editMode }}
                      />
                    )}
                  />
                </div>

                <div className="line-input">
                  <Controller
                    name="surname"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        size="small"
                        label="Sobrenome"
                        fullWidth
                        autoComplete="off"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || " "}
                        {...field}
                        inputProps={{ disabled: !editMode }}
                      />
                    )}
                  />
                </div>

                <div className="line-input">
                  <Controller
                    name="cpf"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        size="small"
                        label="CPF"
                        fullWidth
                        autoComplete="off"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || " "}
                        {...field}
                        inputProps={{ disabled: !editMode }}
                      />
                    )}
                  />
                </div>
                <div className="line-input">
                  <Controller
                    name="birthDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        size="small"
                        label="Data de nascimento"
                        fullWidth
                        autoComplete="off"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || " "}
                        {...field}
                        inputProps={{ disabled: !editMode }}
                      />
                    )}
                  />
                </div>
                <div className="line-input">
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        size="small"
                        label="Email"
                        fullWidth
                        autoComplete="off"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || " "}
                        {...field}
                        inputProps={{ disabled: !editMode }}
                      />
                    )}
                  />
                </div>

                {editMode && (
                  <div className="line-input">
                    <Controller
                      name="password"
                      control={control}
                      render={({ field, fieldState }) => (
                        <TextField
                          size="small"
                          label="Senha"
                          fullWidth
                          autoComplete="off"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message || " "}
                          {...field}
                          inputProps={{ disabled: !editMode }}
                        />
                      )}
                    />
                  </div>
                )}
              </div>

              <div className="upload-image-container">
                <UploadUsersImages
                  setValue={setImageUrl}
                  imageUrl={watch("avatar")}
                  viewMode={!editMode}
                />
              </div>
            </div>

            <div className="bottom-content">
              <div className="line-input city-contaniner">
                <Controller
                  name="address.federative_unity"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      size="small"
                      label="Estado"
                      fullWidth
                      autoComplete="off"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message || " "}
                      {...field}
                      inputProps={{ disabled: !editMode }}
                    />
                  )}
                />
                <Controller
                  name="address.city"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      size="small"
                      label="Cidade"
                      fullWidth
                      autoComplete="off"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message || " "}
                      {...field}
                      inputProps={{ disabled: !editMode }}
                    />
                  )}
                />

                <Controller
                  name="address.zip_code"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      size="small"
                      label="CEP"
                      fullWidth
                      autoComplete="off"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message || " "}
                      {...field}
                      inputProps={{ disabled: !editMode }}
                    />
                  )}
                />
              </div>
              <div className="line-input address-container">
                <Controller
                  name="address.name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      size="small"
                      label="Endereço"
                      fullWidth
                      autoComplete="off"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message || " "}
                      {...field}
                      inputProps={{ disabled: !editMode }}
                    />
                  )}
                />
                <Controller
                  name="address.number"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      size="small"
                      label="Número"
                      fullWidth
                      autoComplete="off"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message || " "}
                      {...field}
                      inputProps={{ disabled: !editMode }}
                    />
                  )}
                />
              </div>
              {arrControllerPhones.map((item: any, index: number) => (
                <div key={index} className="line-input address-container">
                  <Controller
                    name={`phones[${index}].phone_number`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        size="small"
                        label={`Telefone/Whatsapp`}
                        fullWidth
                        autoComplete="off"
                        autoFocus={index > 0}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || " "}
                        {...field}
                        value={watch(`phones[${index}].phone_number`)}
                        inputProps={{ disabled: !editMode }}
                      />
                    )}
                  />
                  {index > 0 && editMode && (
                    <Button
                      style={{ height: "40px" }}
                      color="error"
                      startIcon={<Delete />}
                      variant="outlined"
                      onClick={() => handleDeletePhone(index)}
                    >
                      Remover
                    </Button>
                  )}
                </div>
              ))}

              {editMode && (
                <div className="line-input add-phone">
                  <Button
                    startIcon={<Add />}
                    variant="outlined"
                    onClick={handleAddPhone}
                  >
                    telefone
                  </Button>
                </div>
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
                {editMode && (
                  <>
                    {/* <Button
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
                    </Button> */}
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
                  </>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
