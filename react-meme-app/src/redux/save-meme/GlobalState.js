import React, { createContext, useReducer, useEffect } from "react";
import WatchReducer from "./WatchReducer";

// initial state
const initialState = {
  savelist: localStorage.getItem("savelist")
    ? JSON.parse(localStorage.getItem("savelist"))
    : [],

};

// create context
export const GlobalContext = createContext(initialState);

// provider components
export const GlobalProvider = (props) => {
  const [state, dispatch] = useReducer(WatchReducer, initialState);

  useEffect(() => {
    localStorage.setItem("savelist", JSON.stringify(state.savelist));
   
  }, [state]);

  // actions
  const addMemeToSaveList = (meme) => {
    dispatch({ type: "ADD_MEME_TO_SAVELIST", payload: meme });
  };

  const removeMemeFromSaveList = (id) => {
    dispatch({ type: "REMOVE_MEME_FROM_SAVELIST", payload: id });
  };



  return (
    <GlobalContext.Provider
      value={{
        savelist: state.savelist,

        addMemeToSaveList,
        removeMemeFromSaveList
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};