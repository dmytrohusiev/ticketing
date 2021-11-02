import { GetServerSideProps, NextPage } from "next";
import { buildClient } from "../../api/build-client";
import { Order } from "../../types/order";
import { useContext, useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import { UserContext } from "../../components/Context/UserContext";
import { useRequest } from "../../hooks/use-request";
import { useRouter } from "next/router";

interface InputProps {
  order: Order;
}

const OrderPage: NextPage<InputProps> = ({ order }) => {
  const timeLeft = useTimer(order);
  const currentUser = useContext(UserContext);
  const { push } = useRouter();

  const { doRequest, errors } = useRequest({
    url: `/api/payments`,
    method: "post",
    body: { orderId: order.id },
    onSuccess: () => push("/orders")
  });

  if (timeLeft < 0) {
    return <div>Order expired</div>;
  }

  return (
    <div>
      <div className="mb-3">{timeLeft} seconds until order expires</div>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51Jr3h6AOlC2A2n0xBk56ioCYQ4avdUKgUDBRTw39GyMdNL1bsLeb83wOYmfbvOkfD4MyR3qGXaTh31dbFuKwq0qA00mWx68bzN"
        amount={order.ticket.price * 100}
        email={currentUser?.email}
      />
      {errors}
    </div>
  );
};

function useTimer(order: Order) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let timerId: any = 0;
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt).getTime() - new Date().getTime();

      if (msLeft < 0) {
        setTimeLeft(msLeft);
        clearInterval(timerId);
        return;
      }

      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  return timeLeft;
}

export const getServerSideProps: GetServerSideProps<InputProps> = async ctx => {
  const { data } = await buildClient(ctx).get(`/api/orders/${ctx.query.orderId}`);
  return { props: { order: data } };
};

export default OrderPage;
