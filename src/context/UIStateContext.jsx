// src/context/UIStateContext.jsx
import React, { createContext, useContext, useState } from "react";

const UIStateContext = createContext();

export const UIStateProvider = ({ children }) => {
  const [likedState, setLikedState] = useState({
    scrollY: 0,
    search: "",
    filter: null
  });

  const [matcherState, setMatcherState] = useState({
    scrollY: 0,
    search: "",
    filter: null
  });

  return (
    <UIStateContext.Provider
      value={{ likedState, setLikedState, matcherState, setMatcherState }}
    >
      {children}
    </UIStateContext.Provider>
  );
};

export const useUIState = () => useContext(UIStateContext);
