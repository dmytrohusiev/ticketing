import { NextPage } from "next";
import { useRequest } from "../../hooks/use-request";
import Router from "next/router";
import { useEffect } from "react";

const SignoutPage: NextPage = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    onSuccess: () => Router.push("/")
  });

  useEffect(() => {
    doRequest().catch(console.error);
  }, []);
  return <div>Signing you out...</div>;
};

export default SignoutPage;
