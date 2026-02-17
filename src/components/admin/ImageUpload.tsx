import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";
import ImageCropDialog from "./ImageCropDialog";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  aspect?: number;
}

const ImageUpload = ({ label, value, onChange, folder = "tours", aspect = 16 / 9 }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Image must be less than 10MB"); return; }
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (blob: Blob) => {
    setCropSrc(null);
    setUploading(true);
    const fileName = `${folder}/${crypto.randomUUID()}.webp`;
    const { error } = await supabase.storage.from("tour-images").upload(fileName, blob, { upsert: true, contentType: "image/webp" });
    if (error) { toast.error("Upload failed: " + error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("tour-images").getPublicUrl(fileName);
    onChange(publicUrl);
    setUploading(false);
    toast.success("Image uploaded!");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRemove = () => { onChange(""); if (fileRef.current) fileRef.current.value = ""; };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value ? (
        <div className="relative w-full max-w-xs">
          <img src={value} alt={label} className="w-full h-40 object-cover rounded-lg border" />
          <Button variant="destructive" size="icon" className="absolute top-2 right-2 w-7 h-7" onClick={handleRemove}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          className="w-full max-w-xs h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload className="w-6 h-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload</span>
            </>
          )}
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} disabled={uploading} />
      {cropSrc && (
        <ImageCropDialog
          open={!!cropSrc}
          imageSrc={cropSrc}
          aspect={aspect}
          title={`Crop ${label}`}
          onClose={() => { setCropSrc(null); if (fileRef.current) fileRef.current.value = ""; }}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};

export const GalleryUpload = ({ images, onChange }: { images: string[]; onChange: (urls: string[]) => void }) => {
  const [uploading, setUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const valid = Array.from(files).filter(f => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024);
    if (valid.length === 0) return;
    setPendingFiles(valid);
    setCurrentFileIndex(0);
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(valid[0]);
  };

  const handleCropComplete = async (blob: Blob) => {
    setCropSrc(null);
    setUploading(true);
    const fileName = `gallery/${crypto.randomUUID()}.webp`;
    const { error } = await supabase.storage.from("tour-images").upload(fileName, blob, { upsert: true, contentType: "image/webp" });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from("tour-images").getPublicUrl(fileName);
      onChange([...images, publicUrl]);
    }
    const nextIndex = currentFileIndex + 1;
    if (nextIndex < pendingFiles.length) {
      setCurrentFileIndex(nextIndex);
      const reader = new FileReader();
      reader.onload = () => { setCropSrc(reader.result as string); setUploading(false); };
      reader.readAsDataURL(pendingFiles[nextIndex]);
    } else {
      setUploading(false);
      setPendingFiles([]);
      toast.success("Image(s) uploaded!");
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = (index: number) => onChange(images.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      <Label>Gallery Images</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative">
            <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-24 object-cover rounded-lg border" />
            <Button variant="destructive" size="icon" className="absolute top-1 right-1 w-6 h-6" onClick={() => removeImage(i)}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
        <div
          className="h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (
            <><Upload className="w-5 h-5 text-muted-foreground" /><span className="text-xs text-muted-foreground">Add Images</span></>
          )}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} disabled={uploading} />
      {cropSrc && (
        <ImageCropDialog
          open={!!cropSrc}
          imageSrc={cropSrc}
          aspect={16 / 9}
          title={`Crop Gallery Image (${currentFileIndex + 1}/${pendingFiles.length})`}
          onClose={() => { setCropSrc(null); setPendingFiles([]); if (fileRef.current) fileRef.current.value = ""; }}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};

export default ImageUpload;
