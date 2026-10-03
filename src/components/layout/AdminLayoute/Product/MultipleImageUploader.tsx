// src/components/admin/Product/MultipleImageUploader.tsx
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MultipleImageUploaderProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export default function MultipleImageUploader({
  value = [],
  onChange,
  maxImages = 5,
  maxSizeMB = 5,
}: MultipleImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSize = maxSizeMB * 1024 * 1024;

  const handleFiles = (files: FileList) => {
    const newFiles: File[] = [];
    const remainingSlots = maxImages - value.length;

    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    Array.from(files)
      .slice(0, remainingSlots)
      .forEach((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          return;
        }
        if (file.size > maxSize) {
          toast.error(`${file.name} is too large (max ${maxSizeMB}MB)`);
          return;
        }
        newFiles.push(file);
      });

    if (newFiles.length > 0) {
      onChange([...value, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Drop Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 cursor-pointer",
          "flex flex-col items-center justify-center gap-2 transition-all",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          value.length >= maxImages && "opacity-50 pointer-events-none"
        )}
      >
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">
            Click or drag images here
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Max {maxImages} images • {maxSizeMB}MB each
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {value.map((file, index) => (
            <ImagePreview
              key={index}
              file={file}
              index={index}
              onRemove={handleRemove}
              isMain={index === 0}
            />
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {value.length} / {maxImages} images uploaded
        {value.length > 0 && " • First image will be main thumbnail"}
      </p>
    </div>
  );
}

// 🔥 Image Preview Component
function ImagePreview({
  file,
  index,
  onRemove,
  isMain,
}: {
  file: File;
  index: number;
  onRemove: (index: number) => void;
  isMain: boolean;
}) {
  const [preview, setPreview] = useState<string>("");

  useState(() => {
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  });

  return (
    <div className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
      {preview && (
        <img
          src={preview}
          alt={file.name}
          className="w-full h-full object-cover"
        />
      )}

      {isMain && (
        <span className="absolute top-1 left-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          MAIN
        </span>
      )}

      <Button
        type="button"
        size="icon"
        variant="destructive"
        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onRemove(index)}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}