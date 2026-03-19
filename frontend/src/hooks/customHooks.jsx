import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { VizContext } from "../context/VizContext";
import { AlertContext } from "../context/AlertContext";

export const useTheme = () => useContext(ThemeContext);

export const useViz = () => useContext(VizContext);

export const useAlert = () => useContext(AlertContext);