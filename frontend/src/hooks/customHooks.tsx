import { useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AlertContext, AlertContextType } from "../context/AlertContext";

export const useTheme = () => useContext(ThemeContext);

export const useAlert = (): AlertContextType => useContext(AlertContext);

export const useTitle = (title: string) => {
    useEffect(() => {
        const prevTitle = document.title;
        title ? document.title = `${title} | LumiVizStack` : document.title = prevTitle
        return () => {
            document.title = prevTitle;
        }
    }, [title]);
};