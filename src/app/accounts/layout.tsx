import VerticalNavigation from '@/Components/Navigation/verticalProductNav';
import Footer from "@/Components/Footer/footer";
import TopBar from '../../Components/Header/topbar';


export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar at the top */}
      <TopBar />
      
      {/* Main content area with sidebar and content */}
      <div className="flex flex-1">
        {/* left: vertical nav */}
        <aside className="w-64 bg-gray-50 border-r border-gray-200">
          <VerticalNavigation />
        </aside>

        {/* right: page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      
      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
}