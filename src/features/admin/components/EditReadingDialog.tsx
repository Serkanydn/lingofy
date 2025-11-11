"use client";

import { useState, useEffect } from "react";
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
import { useUpdateReading } from "@/features/admin/hooks/useReadingContent";
import { Level } from "@/shared/types/common.types";
import { ReadingText } from "@/features/reading/types/service.types";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

interface EditReadingDialogProps {
  open: boolean;
  onClose: () => void;
  reading: ReadingText | null;
}

export function EditReadingDialog({
  open,
  onClose,
  reading,
}: EditReadingDialogProps) {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<string>("B1");
  const [content, setContent] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState("");
  const [orderIndex, setOrderIndex] = useState("1");
  const [isPremium, setIsPremium] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const updateReading = useUpdateReading();

  useEffect(() => {
    if (reading) {
      setTitle(reading.title);
      setLevel(reading.level);
      setContent(reading.content);
      setCurrentAudioUrl(reading.audio_url || "");
      setAudioFile(null);
      setOrderIndex(String(reading.order_index));
      setIsPremium(reading.is_premium);
    }
  }, [reading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reading) return;

    let finalAudioUrl = currentAudioUrl;

    // Upload new audio file if provided
    if (audioFile) {
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", audioFile);

        const response = await fetch("/api/audio/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload audio");
        }

        const data = await response.json();
        finalAudioUrl = data.url;

        // Delete old audio file if it exists and is different
        if (currentAudioUrl && currentAudioUrl !== finalAudioUrl) {
          try {
            await fetch("/api/audio/delete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: currentAudioUrl }),
            });
          } catch (error) {
            console.error("Failed to delete old audio:", error);
          }
        }
      } catch (error) {
        console.error("Audio upload error:", error);
        alert("Failed to upload audio file. Please try again.");
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    await updateReading.mutateAsync({
      id: reading.id,
      data: {
        title,
        level: level as Level,
        content,
        audio_url: finalAudioUrl,
        order_index: parseInt(orderIndex),
        is_premium: isPremium,
        content_id: reading.content_id,
        updated_at: new Date().toISOString(),
      },
    });

    onClose();
  };

  if (!reading) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-0">
        <DialogHeader className="space-y-4 pb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 flex items-center justify-center shadow-[0_4px_14px_rgba(34,197,94,0.4)]">
            <span className="text-4xl">📖</span>
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Edit Reading Content
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-400">
            Update the reading text details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-4">
            <div className="space-y-2 flex-1">
              <Label
                htmlFor="title"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Title *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., The History of Coffee"
                required
                className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
              />
            </div>

            <div className="space-y-2 flex-1">
              <Label
                htmlFor="level"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Level *
              </Label>
              <Select
                value={level}
                onValueChange={(val) => setLevel(val as Level)}
                required
              >
                <SelectTrigger className="rounded-2xl border-2 w-full border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300">
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
            <Label
              htmlFor="content"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Reading Text *
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the reading text..."
              rows={12}
              required
              className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="audioFile"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Upload New Audio (optional)
              </Label>
              <Input
                id="audioFile"
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-orange-900/20 dark:file:text-orange-400"
              />
              {audioFile ? (
                <p className="text-sm text-green-600 dark:text-green-400">
                  New: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              ) : currentAudioUrl ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current: {currentAudioUrl.split("/").pop()}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  No audio file
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="orderIndex"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Order Index
              </Label>
              <Input
                id="orderIndex"
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(e.target.value)}
                min="1"
                className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-900/10 border-2 border-orange-100 dark:border-orange-900/30">
            <input
              type="checkbox"
              id="isPremium"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
              className="h-5 w-5 rounded-lg border-2 border-orange-300 text-orange-500 focus:ring-orange-500 focus:ring-2 focus:ring-offset-2"
            />
            <Label
              htmlFor="isPremium"
              className="text-sm font-semibold text-orange-700 dark:text-orange-400 cursor-pointer flex items-center gap-2"
            >
              <span>👑</span> Premium Content
            </Label>
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
              disabled={updateReading.isPending || isUploading}
            >
              {isUploading
                ? "Uploading Audio..."
                : updateReading.isPending
                ? "Updating..."
                : "Update Reading"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
