import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Loader2, X, File } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PdfUploadZoneProps {
  onTextExtracted: (text: string) => void;
  disabled?: boolean;
}

const PdfUploadZone = ({ onTextExtracted, disabled }: PdfUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File too large. Maximum 20MB.");
      return;
    }

    setFileName(file.name);
    setIsParsing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data, error } = await supabase.functions.invoke("parse-pdf", {
        body: formData,
      });

      if (error) throw new Error(error.message || "Failed to parse PDF");
      if (data.error) throw new Error(data.error);

      if (data.text) {
        onTextExtracted(data.text);
        toast.success(`Extracted text from "${file.name}" — ready to analyze!`);
      }
    } catch (err: any) {
      console.error("PDF parse error:", err);
      toast.error(err.message || "Failed to extract text from PDF");
      setFileName(null);
    } finally {
      setIsParsing(false);
    }
  }, [onTextExtracted]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isParsing) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [disabled, isParsing, handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isParsing) setIsDragging(true);
  }, [disabled, isParsing]);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleClick = () => {
    if (!disabled && !isParsing) inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const clearFile = () => {
    setFileName(null);
  };

  return (
    <div className="mb-4">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleInputChange}
      />
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        whileHover={!disabled && !isParsing ? { scale: 1.005 } : {}}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 transition-all text-center ${
          isDragging
            ? "border-primary bg-primary/10"
            : fileName
            ? "border-primary/30 bg-primary/5"
            : "border-border hover:border-primary/40 hover:bg-primary/5"
        } ${disabled || isParsing ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {isParsing ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground font-body">
              Extracting text from <span className="text-foreground font-semibold">{fileName}</span>...
            </p>
          </div>
        ) : fileName ? (
          <div className="flex items-center justify-center gap-3">
            <File className="w-6 h-6 text-primary" />
            <span className="text-sm text-foreground font-body font-semibold">{fileName}</span>
            <button
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm font-body">
              <span className="text-primary font-semibold">Click to upload</span>
              <span className="text-muted-foreground"> or drag & drop a PDF</span>
            </p>
            <p className="text-xs text-muted-foreground">PDF up to 20MB</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PdfUploadZone;
