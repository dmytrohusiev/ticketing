import React from "react";
import axios, { AxiosInstance } from "axios";

export const ApiClientContext = React.createContext<AxiosInstance>(axios.create({ baseURL: "/" }));

export const ApiClientContextSlot: React.FC<{ client: AxiosInstance }> = ({ client, children }) => {
  return <ApiClientContext.Provider value={client}>{children}</ApiClientContext.Provider>;
};
