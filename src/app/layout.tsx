import type {Metadata} from "next";
import "./globals.css";
import "./raycast.css";

export const metadata: Metadata = {
  title: "Achraf Ennadiri — Engineer & Creative Director",
  description: "Software engineer and commercial video editor building systems and directing visuals in Ben Guerir, Morocco.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
