import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Digital Marketplace",
  description: "Buy and sell digital goods",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
