import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />
      <div className="pl-16">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
