import { getEnv } from "@povertay/common";

const is_test = process.env.NODE_ENV === "test";
export const config = {
  is_test,
  nats: {
    uri: getEnv({ name: "NATS_URI", throwOnEmpty: !is_test }),
    cluster_id: getEnv({ name: "NATS_CLUSTER_ID", throwOnEmpty: !is_test }),
    client_id: getEnv({ name: "NATS_CLIENT_ID", throwOnEmpty: !is_test })
  },
  redis: {
    host: getEnv({ name: "REDIS_HOST", throwOnEmpty: !is_test })
  }
};
