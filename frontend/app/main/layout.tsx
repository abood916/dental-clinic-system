
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <main className="min-w-0 flex-1 p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
