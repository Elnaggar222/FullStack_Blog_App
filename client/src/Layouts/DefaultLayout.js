import { Outlet } from "react-router-dom";
import Header from "../components/layouts/Header";

const DefaultLayout = () => {
  return (
    <>
      <main>
        <Header />
        <Outlet />
      </main>
    </>
  );
};

export default DefaultLayout;
