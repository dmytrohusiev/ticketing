import { getEnv } from "@povertay/common";

const is_test = process.env.NODE_ENV === "test";
export const config = {
  mongo_uri: getEnv({ name: "MONGO_URI", throwOnEmpty: !is_test }),
  jwt_secret: getEnv({ name: "JWT_KEY", throwOnEmpty: !is_test }),
  is_test
};
