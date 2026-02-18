import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ComboRow {
  id: string;
  title: string;
  status: string;
  combo_price: number;
  popular: boolean | null;
  created_at: string;
  tour_ids: string[];
}

const AdminCombos = () => {
  const [combos, setCombos] = useState<ComboRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCombos = async () => {
    const { data, error } = await supabase
      .from("combo_deals")
      .select("id, title, status, combo_price, popular, created_at, tour_ids")
      .order("created_at", { ascending: false });
    if (error) { toast.error(error.message); return; }
    setCombos((data as unknown as ComboRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchCombos(); }, []);

  const deleteCombo = async (id: string) => {
    if (!confirm("Delete this combo deal?")) return;
    const { error } = await supabase.from("combo_deals").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Combo deal deleted");
    fetchCombos();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Combo Deals</h2>
        <Button asChild>
          <Link to="/admin/combos/create"><Plus className="w-4 h-4 mr-2" /> Add Combo</Link>
        </Button>
      </div>

      <div className="bg-card rounded-xl border shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : combos.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No combo deals yet. Create your first combo!</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Tours</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {combos.map((combo) => (
                <TableRow key={combo.id}>
                  <TableCell className="font-medium">
                    {combo.title}
                    {combo.popular && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />Popular
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{combo.tour_ids?.length || 0} tours</TableCell>
                  <TableCell>AED {Number(combo.combo_price).toFixed(0)}</TableCell>
                  <TableCell>
                    <Badge variant={combo.status === "published" ? "default" : "outline"}>
                      {combo.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/combos/edit/${combo.id}`}><Pencil className="w-4 h-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteCombo(combo.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AdminCombos;
