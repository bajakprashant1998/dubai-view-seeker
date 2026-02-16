import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, FileText, Eye } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });

  useEffect(() => {
    const fetch = async () => {
      const { count: total } = await supabase.from("tours").select("*", { count: "exact", head: true });
      const { count: published } = await supabase.from("tours").select("*", { count: "exact", head: true }).eq("status", "published");
      const { count: draft } = await supabase.from("tours").select("*", { count: "exact", head: true }).eq("status", "draft");
      setStats({ total: total || 0, published: published || 0, draft: draft || 0 });
    };
    fetch();
  }, []);

  const cards = [
    { label: "Total Tours", value: stats.total, icon: Map, color: "bg-primary text-primary-foreground" },
    { label: "Published", value: stats.published, icon: Eye, color: "bg-green-600 text-white" },
    { label: "Drafts", value: stats.draft, icon: FileText, color: "bg-amber-500 text-white" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.color}`}>
                <c.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
