import { useEffect, useState } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Map, LogOut, Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Tours", icon: Map, path: "/admin/tours" },
];

const AdminLayout = () => {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/admin/login"); return; }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");

      if (!roles || roles.length === 0) {
        await supabase.auth.signOut();
        navigate("/admin/login");
        toast.error("Access denied");
        return;
      }
      setLoading(false);
    };
    check();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/admin" className="font-bold text-lg text-foreground font-['Playfair_Display']">Admin Panel</Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path))
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 bg-card border-b px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Better View Tourism</h1>
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
