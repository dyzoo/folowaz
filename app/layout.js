import "../styles.css";
import "./platform.css";

export const metadata = {
  title: "Folowaz | Social Media Boost Checker",
  description:
    "Choose a social network, check your username, select a follower package, and prepare payment in a simple presentation demo.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
