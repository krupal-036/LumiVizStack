import { createContext, useState } from "react";

export const VizContext = createContext();

export function VizProvider({ children }) {
  const [config, setConfig] = useState({});
  return (
    <VizContext value={{ config, setConfig }}>
      {children}
    </VizContext>
  );
}