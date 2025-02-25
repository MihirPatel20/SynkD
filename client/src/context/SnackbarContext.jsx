// SnackbarContext.jsx
import React, { createContext, useReducer, useContext } from 'react';
import { Snackbar, Alert } from '@mui/material';

const SnackbarContext = createContext();
const SnackbarDispatchContext = createContext();

const initialState = {
  open: false,
  message: '',
  type: 'info', // success, error, info, warning
  position: 'bottom-left',
};

function snackbarReducer(state, action) {
  switch (action.type) {
    case 'SHOW_SNACKBAR':
      return {
        ...state,
        open: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
        position: action.payload.position || 'bottom-left',
      };
    case 'CLOSE_SNACKBAR':
      return {
        ...state,
        open: false,
      };
    default:
      return state;
  }
}

export function SnackbarProvider({ children }) {
  const [state, dispatch] = useReducer(snackbarReducer, initialState);
  
  const handleClose = () => {
    dispatch({ type: 'CLOSE_SNACKBAR' });
  };

  // Calculate position based on state.position
  const getPosition = () => {
    switch(state.position) {
      case 'top-right':
        return { vertical: 'top', horizontal: 'right' };
      case 'top-left':
        return { vertical: 'top', horizontal: 'left' };
      case 'bottom-left':
        return { vertical: 'bottom', horizontal: 'left' };
      case 'bottom-right':
      default:
        return { vertical: 'bottom', horizontal: 'right' };
    }
  };
  
  return (
    <SnackbarContext.Provider value={state}>
      <SnackbarDispatchContext.Provider value={dispatch}>
        {children}
        <Snackbar
          open={state.open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={getPosition()}
        >
          <Alert 
            onClose={handleClose} 
            severity={state.type}
            sx={{ width: '100%' }}
          >
            {state.message}
          </Alert>
        </Snackbar>
      </SnackbarDispatchContext.Provider>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const state = useContext(SnackbarContext);
  const dispatch = useContext(SnackbarDispatchContext);
  
  const showSnackbar = (message, type = 'info', position = 'bottom-left') => {
    dispatch({ 
      type: 'SHOW_SNACKBAR', 
      payload: { message, type, position } 
    });
  };
  
  const closeSnackbar = () => {
    dispatch({ type: 'CLOSE_SNACKBAR' });
  };
  
  return { state, showSnackbar, closeSnackbar };
}
