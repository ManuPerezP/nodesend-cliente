import authContext from "./authContext";
import React, { useReducer } from "react";
import authReducer from "./authReducer";
import {
  USUARIO_AUTENTICADO,
  REGISTRO_EXITOSO,
  REGISTRO_ERROR,
  LIMPIAR_ALERTA,
  LOGIN_ERROR,
  LOGIN_EXITOSO,
  CERRAR_SESSION,
} from "../../types";

import clienteAxios from "../../config/axios";
import tokenAuth from "../../config/tokenAuth";

const AuthState = ({ children }) => {
  //state inicial
  const initialState = {
    token: typeof window !== "undefined" ? localStorage.getItem("token") : "", //determina si estamos corriendo en el cliente (window) o server
    autenticado: null,
    usuario: null,
    mensaje: null,
  };

  //definir reducer
  const [state, dispatch] = useReducer(authReducer, initialState);

  const iniciarSesion = async (datos) => {
    try {
      const resp = await clienteAxios.post("/api/auth", datos);
      console.log(resp.data.token);
      dispatch({
        type: LOGIN_EXITOSO,
        payload: resp.data.token,
      });
    } catch (error) {
      console.log(error.response.data.msg);
      dispatch({
        type: LOGIN_ERROR,
        payload: error.response.data.msg,
      });
    }
  };

  const registrarUsuario = async (datos) => {
    try {
      const resp = await clienteAxios.post("/api/usuarios", datos);

      dispatch({
        type: REGISTRO_EXITOSO,
        payload: resp.data.msg,
      });
    } catch (error) {
      dispatch({
        type: REGISTRO_ERROR,
        payload: error.response.data.msg,
      });
      //    console.log(error.response.data.msg);
    }
    //limpiar alertaS
    setTimeout(() => {
      dispatch({
        type: LIMPIAR_ALERTA,
      });
    }, 3000);
  };

  const usuarioAutenticado = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      tokenAuth(token);
    }
    try {
      const resp = await clienteAxios.get("/api/auth");

      if (resp.data.usuario) {
        dispatch({
          type: USUARIO_AUTENTICADO,
          payload: resp.data.usuario,
        });
      }
    } catch (error) {
      dispatch({
        type: LOGIN_ERROR,
        payload: error.response.data.msg,
      });
    }
  };

  const cerrarSesion = () => {
    console.log("cerrarSesion");
    dispatch({
      type: CERRAR_SESSION,
    });
  };

  return (
    <authContext.Provider
      value={{
        token: state.token,
        autenticado: state.autenticado,
        usuario: state.usuario,
        mensaje: state.mensaje,
        usuarioAutenticado,
        registrarUsuario,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthState;
