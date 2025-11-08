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

export function EditReadingDialog({ open, onClose, reading }: EditReadingDialogProps) {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<string>("B1");
  const [content, setContent] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [orderIndex, setOrderIndex] = useState("1");
  const [isPremium, setIsPremium] = useState(false);

  const updateReading = useUpdateReading();

  useEffect(() => {
    if (reading) {
      setTitle(reading.title);
      setLevel(reading.level);
      setContent(reading.content);
      setAudioUrl(reading.audio_url || "");
      setOrderIndex(String(reading.order_index));
      setIsPremium(reading.is_premium);
    }
  }, [reading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reading) return;

    await updateReading.mutateAsync({
      id: reading.id,
      data: {
        title,
        level: level as Level,
        content,
        audio_url: audioUrl,
        order_index: parseInt(orderIndex),
        is_premium: isPremium,
        quiz_content_id: reading.quiz_content_id,
        word_count: content.trim().split(/\s+/).length,
        updated_at: new Date().toISOString(),
      },
    });

    onClose();
  };

  if (!reading) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Reading Content</DialogTitle>
          <DialogDescription>
            Update the reading text details
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
                placeholder="e.g., The History of Coffee"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <Select value={level} onValueChange={(val) => setLevel(val as Level)} required>
                <SelectTrigger>
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

            <div className="space-y-2">
              <Label htmlFor="audioUrl">Audio URL (optional)</Label>
              <Input
                id="audioUrl"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderIndex">Order Index</Label>
              <Input
                id="orderIndex"
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(e.target.value)}
                min="1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPremium"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isPremium">Premium Content</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Reading Text *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the reading text..."
              rows={15}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={updateReading.isPending}
            >
              {updateReading.isPending ? "Updating..." : "Update Reading"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
