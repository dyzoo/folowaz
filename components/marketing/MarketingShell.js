import Header from "./Header";
import Footer from "./Footer";
import ScrollEffects from "./ScrollEffects";
import Announcement from "./Announcement";

export default function MarketingShell({ children }) {
  return (
    <>
      <ScrollEffects />
      <Announcement />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
