import Footer from "@/Components/Footer/footer";
import Header from "@/Components/Header/header";
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Regular to Bold
  variable: '--font-poppins', // Expose as CSS variable
})


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <html lang="en" className={poppins.variable}>
      <body className="font-poppins bg-white text-gray-900">
        {children}
      </body>
    </html>
      <Footer />
    </>
  );
}


