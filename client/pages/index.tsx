import { GetServerSideProps, NextPage } from "next";
import React from "react";
import { buildClient } from "../api/build-client";
import { Ticket } from "../types/ticket";
import Link from "next/link";

const Landing: NextPage<{ tickets: Ticket[] }> = ({ tickets }) => {
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td>{ticket.title}</td>
              <td>{ticket.price}</td>
              <td>
                <Link href={`/tickets/${ticket.id}`}>
                  <a>View</a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { data } = await buildClient(ctx).get("/api/tickets");
  return { props: { tickets: data } };
};

export default Landing;
