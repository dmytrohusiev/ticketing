import "bootstrap/dist/css/bootstrap.css";
import App, { AppContext, AppProps } from "next/app";
import { buildClient } from "../api/build-client";
import { AxiosResponse } from "axios";
import { Header } from "../components/Layout/Header";
import { CurrentUser } from "../types/current-user";
import { UserContextSlot } from "../components/Context/UserContext";

type InputProps = { currentUser: CurrentUser | null };

function MyApp({ Component, pageProps }: AppProps<InputProps>) {
  const { currentUser } = pageProps as InputProps;
  return (
    <UserContextSlot currentUser={currentUser}>
      <div>
        <Header currentUser={currentUser} />
        <div className="container">
          <Component {...pageProps} />
        </div>
      </div>
    </UserContextSlot>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  try {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get<InputProps, AxiosResponse<CurrentUser | null>>("/api/users/currentuser");
    return { ...appProps, pageProps: { ...data } };
  } catch (err) {
    return { ...appProps };
  }
};

export default MyApp;
