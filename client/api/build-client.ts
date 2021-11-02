import axios from "axios";
import { IncomingMessage } from "http";

export const buildClient = ({ req }: { req?: IncomingMessage }) => {
  if (!req) {
    return axios.create({ baseURL: "/" });
  }

  return axios.create({
    baseURL: "http://www.husiev-dmytro.xyz",
    headers: req.headers as Record<string, string>
  });
};
