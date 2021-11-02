import { GetServerSideProps, NextPage } from "next";
import { buildClient } from "../../api/build-client";
import { Ticket } from "../../types/ticket";
import { useRequest } from "../../hooks/use-request";
import { useRouter } from "next/router";
import { Order } from "../../types/order";

interface InputProps {
  ticket: Ticket;
}

const TicketShowPage: NextPage<InputProps> = ({ ticket }) => {
  const { push } = useRouter();
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: { ticketId: ticket.id },
    onSuccess: (order: Order) => push(`/orders/${order.id}`)
  });
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button className="btn btn-primary" onClick={() => doRequest()}>
        Purchase
      </button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<InputProps> = async ctx => {
  const { data } = await buildClient(ctx).get(`/api/tickets/${ctx.query.ticketId}`);
  return { props: { ticket: data } };
};

export default TicketShowPage;
