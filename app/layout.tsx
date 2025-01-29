import { ReactNode } from "react";
import "./global.css";

export const metadtata = {
  title: "asd",
  description: "asdfasdf",
};

const RootLayout = ({ children }: { children: ReactNode[] }) => {
  return (
    <html lang={"en"}>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
