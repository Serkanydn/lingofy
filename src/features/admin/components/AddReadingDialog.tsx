"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateReading } from "@/features/admin/hooks/useReadingContent";
import { Level } from "@/shared/types/common.types";
import { uploadAudioAsset } from "@/shared/services/audioUploadService";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

interface AddReadingDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddReadingDialog({ open, onClose }: AddReadingDialogProps) {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<string>("");
  const [content, setContent] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [orderIndex, setOrderIndex] = useState("1");
  const [isUploading, setIsUploading] = useState(false);

  const createReading = useCreateReading();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!level) return;

    let audioAssetId: string | undefined = undefined;

    // Upload audio file if provided
    if (audioFile) {
      try {
        setIsUploading(true);
        
        console.log('Starting audio upload:', {
          name: audioFile.name,
          size: audioFile.size,
          type: audioFile.type,
        });
        
        // Use the new audio asset upload service
        const result = await uploadAudioAsset({
          file: audioFile,
          contentType: 'reading',
        });

        if (!result.success || !result.audioAsset) {
          const errorMsg = result.error || 'Failed to upload audio';
          console.error('Upload failed:', errorMsg);
          alert(`Failed to upload audio file: ${errorMsg}`);
          setIsUploading(false);
          return;
        }

        console.log('Audio uploaded successfully:', result.audioAsset);
        audioAssetId = result.audioAsset.id;
      } catch (error) {
        console.error("Audio upload error:", error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        alert(`Failed to upload audio file: ${errorMsg}`);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    await createReading.mutateAsync({
      title,
      level: level as Level,
      content,
      audio_url: audioAssetId ? '' : '', // Keep for backward compatibility, can be removed later
      audio_asset_id: audioAssetId,
      is_premium: isPremium,
      order_index: parseInt(orderIndex),
      updated_at: new Date().toISOString(),
    });

    // Reset form
    setTitle("");
    setLevel("");
    setContent("");
    setAudioFile(null);
    setIsPremium(false);
    setOrderIndex("1");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-0">
        <DialogHeader className="space-y-4 pb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(34,197,94,0.4)]">
            <span className="text-4xl">📖</span>
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Add Reading Content
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-400">
            Create a new reading text with comprehension exercises
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., My Daily Routine"
                className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="level">Level *</Label>
              <Select value={level} onValueChange={setLevel} required>
                <SelectTrigger className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 w-full">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>
                      {lvl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the reading text (use double line breaks for paragraphs)..."
              className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
              rows={12}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audioFile">Audio File</Label>
            <Input
              id="audioFile"
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-orange-900/20 dark:file:text-orange-400"
            />
            {audioFile && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Selected: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 items-start">
            <div className="space-y-2">
              <Label htmlFor="orderIndex">Order Index</Label>
              <Input
                id="orderIndex"
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(e.target.value)}
                className="rounded-2xl border-2 border-gray-200 dark:border-gray-700"
                min="1"
              />
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-900/10 border-2 border-orange-100 dark:border-orange-900/30">
              <Checkbox
                id="isPremium"
                checked={isPremium}
                onCheckedChange={(checked) => setIsPremium(checked as boolean)}
                className="h-5 w-5 rounded-lg border-2 border-orange-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <Label
                htmlFor="isPremium"
                className="text-sm font-semibold text-orange-700 dark:text-orange-400 cursor-pointer flex items-center gap-2"
              >
                <span>👑</span> Premium Content
              </Label>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300"
              disabled={createReading.isPending || isUploading}
            >
              {isUploading
                ? "Uploading Audio..."
                : createReading.isPending
                ? "Creating..."
                : "Create Reading"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
