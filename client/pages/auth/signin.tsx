import { NextPage } from "next";
import { FormEventHandler, useState } from "react";
import Router from "next/router";
import { useRequest } from "../../hooks/use-request";

const SignInPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: { email, password },
    onSuccess: () => Router.push("/")
  });

  const onSubmit: FormEventHandler = async event => {
    event.preventDefault();
    await doRequest();
  };
  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="text" id="email" className="form-control" />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          id="password"
          className="form-control"
        />
      </div>
      {errors}
      <button type="submit" className="btn btn-primary">
        Sign In
      </button>
    </form>
  );
};

export default SignInPage;
