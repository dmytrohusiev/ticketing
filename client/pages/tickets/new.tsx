import { NextPage } from "next";
import React, { FormEvent, useState } from "react";
import { useRequest } from "../../hooks/use-request";
import { useRouter } from "next/router";

const NewTicketPage: NextPage = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { push } = useRouter();
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: { title, price },
    onSuccess: () => push("/")
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    doRequest().catch();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create a ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input className="form-control" value={price} onChange={e => setPrice(e.target.value)} onBlur={onBlur} />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
      {errors}
    </div>
  );
};

export default NewTicketPage;
