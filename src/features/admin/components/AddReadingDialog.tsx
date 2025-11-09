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

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

interface AddReadingDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddReadingDialog({ open, onClose }: AddReadingDialogProps) {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<string>("");
  const [content, setContent] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [orderIndex, setOrderIndex] = useState("1");

  const createReading = useCreateReading();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!level) return;

    await createReading.mutateAsync({
      title,
      level: level as Level,
      content,
      audio_url: audioUrl,
      is_premium: isPremium,
      order_index: parseInt(orderIndex),
      content_id: crypto.randomUUID(),
      word_count: content.trim().split(/\s+/).length,
      updated_at: new Date().toISOString(),
    });

    // Reset form
    setTitle("");
    setLevel("");
    setContent("");
    setAudioUrl("");
    setIsPremium(false);
    setOrderIndex("1");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Reading Content</DialogTitle>
          <DialogDescription>
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <Select value={level} onValueChange={setLevel} required>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the reading text (use double line breaks for paragraphs)..."
              rows={12}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audioUrl">Audio URL</Label>
            <Input
              id="audioUrl"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              placeholder="https://example.com/audio.mp3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="isPremium"
                checked={isPremium}
                onCheckedChange={(checked) => setIsPremium(checked as boolean)}
              />
              <Label htmlFor="isPremium">Premium Content</Label>
            </div>
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
              disabled={createReading.isPending}
            >
              {createReading.isPending ? "Creating..." : "Create Reading"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
