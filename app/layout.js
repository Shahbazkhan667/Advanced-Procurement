import "./globals.css";
import { StoreProvider } from "../lib/store";
export const metadata = {
  title: "ProCureX — Procurement, made clear",
  description: "Enterprise procurement and vendor management workspace",
  applicationName: "ProCureX",
};
export const viewport = {
  themeColor: "#f8f9fa",
  width: "device-width",
  initialScale: 1,
  userScalable: true,
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
