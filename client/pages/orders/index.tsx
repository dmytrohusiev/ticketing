import { GetServerSideProps, NextPage } from "next";
import { buildClient } from "../../api/build-client";
import { Ticket } from "../../types/ticket";
import { Order } from "../../types/order";

interface InputProps {
  orders: Order[];
}

const MyOrdersPage: NextPage<InputProps> = ({ orders }) => {
  return (
    <ul>
      {orders.map(order => (
        <li key={order.id}>
          {order.ticket.title} - {order.status}
        </li>
      ))}
    </ul>
  );
};

export const getServerSideProps: GetServerSideProps<InputProps> = async ctx => {
  const { data } = await buildClient(ctx).get("/api/orders");
  return { props: { orders: data } };
};

export default MyOrdersPage;
