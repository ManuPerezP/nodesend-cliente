import {
  USUARIO_AUTENTICADO,
  REGISTRO_EXITOSO,
  REGISTRO_ERROR,
  LIMPIAR_ALERTA,
  LOGIN_ERROR, LOGIN_EXITOSO,CERRAR_SESSION
} from "../../types";

export default (state, action) => {
  switch (action.type) {
    case USUARIO_AUTENTICADO:
      return {
        ...state,
        usuario: action.payload,
        autenticado: true
      };

    case REGISTRO_EXITOSO:
    case REGISTRO_ERROR:
    case LOGIN_ERROR:
      return {
        ...state,
        mensaje: action.payload,
      }
    case LOGIN_EXITOSO:
          localStorage.setItem('token',action.payload);
        return {
            ...state,
            token: action.payload,
            autenticado: true
        }
    case LIMPIAR_ALERTA:
      return {
        ...state,
        mensaje: null,
      };
    case CERRAR_SESSION:
          localStorage.removeItem('token');
      return{
        ...state,
        usuario: null,
        token: null,
        autenticado: null
      }
    default:
      return state;
  }
};
