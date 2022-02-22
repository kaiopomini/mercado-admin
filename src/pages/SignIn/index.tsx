import {
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import logoBlue from "../../assets/img/logo-blue.png";
import logoYellow from "../../assets/img/logo-yellow.png";
import { useAuth } from "../../hooks/auth";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import "./styles.scss";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export function SignIn() {
  const navigate = useNavigate();

  const { signIn, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated()]);

  const schema = Yup.object().shape({
    username: Yup.string().required("Usuário é obrigatório"),
    password: Yup.string().required("Senha é obrigatória"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  async function handleSignIn(data: any) {
    setIsLoading(true);

    const login = await signIn(data.username, data.password);

    if(login.success) {
      navigate("/");
    } 
    // console.log(login.message)

    setIsLoading(false);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={logoYellow} alt="ilustração" />
        <strong>Mercado Campos</strong>
        <p>Dashboard Administrativo</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoBlue} alt="ilustração" />
          <div className="title-form">Login</div>
          <form onSubmit={handleSubmit(handleSignIn)} onReset={reset}>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Usuário"
                  fullWidth
                  autoFocus
                  error={!!errors.username}
                  helperText={errors.username?.message || " "}
                  {...field}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Senha"
                  placeholder="Senha"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    style: {
                      background: "#fff",
                    },
                  }}
                  error={!!errors.password}
                  helperText={errors.password?.message || " "}
                  {...field}
                />
              )}
            />
            <button className="login-btn" type="submit" disabled={isLoading}>
              {isLoading ? <CircularProgress color="inherit" /> : "Entrar"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
