import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { VizContext } from "../context/VizContext";

export function useTheme() {
    return useContext(ThemeContext);
}

export function useViz() {
    return useContext(VizContext);
}
