import Footer from "@/Components/Footer/footer";
import Header from "@/Components/Header/mainNavBar";


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}


