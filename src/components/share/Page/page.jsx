import { Header } from "../Header/header.jsx";

export const Page = ({ children, noHeader }) => {
  return (
    <>
      {!noHeader && <Header />}
      {children}
    </>
  );
};
