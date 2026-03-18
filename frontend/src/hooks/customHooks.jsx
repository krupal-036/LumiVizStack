import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { VizContext } from "../context/VizContext";
import { ErrorContext } from "../context/ErrorContext";

export const useTheme = () => useContext(ThemeContext);

export const useViz = () => useContext(VizContext);

export const useError = () => useContext(ErrorContext);