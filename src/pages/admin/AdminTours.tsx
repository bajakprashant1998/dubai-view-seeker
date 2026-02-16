import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Tour {
  id: string;
  title: string;
  status: string;
  category: string | null;
  adult_price: number;
  created_at: string;
  featured: boolean;
}

const AdminTours = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTours = async () => {
    const { data, error } = await supabase.from("tours").select("id, title, status, category, adult_price, created_at, featured").order("created_at", { ascending: false });
    if (error) { toast.error(error.message); return; }
    setTours(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchTours(); }, []);

  const deleteTour = async (id: string) => {
    if (!confirm("Delete this tour?")) return;
    const { error } = await supabase.from("tours").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Tour deleted");
    fetchTours();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Tours</h2>
        <Button asChild>
          <Link to="/admin/tours/create"><Plus className="w-4 h-4 mr-2" /> Add Tour</Link>
        </Button>
      </div>

      <div className="bg-card rounded-xl border shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : tours.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No tours yet. Create your first tour!</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tours.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell className="font-medium">
                    {tour.title}
                    {tour.featured && <Badge variant="secondary" className="ml-2 text-xs">Featured</Badge>}
                  </TableCell>
                  <TableCell>{tour.category || "—"}</TableCell>
                  <TableCell>AED {Number(tour.adult_price).toFixed(0)}</TableCell>
                  <TableCell>
                    <Badge variant={tour.status === "published" ? "default" : "outline"}>
                      {tour.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/tours/edit/${tour.id}`}><Pencil className="w-4 h-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteTour(tour.id)}>
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

export default AdminTours;
