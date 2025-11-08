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
import { useCreateListening } from "@/features/admin/hooks/useListeningContent";
import { Level } from "@/shared/types/common.types";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

interface AddListeningDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddListeningDialog({ open, onClose }: AddListeningDialogProps) {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<string>("");
  const [description, setDescription] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [duration, setDuration] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [orderIndex, setOrderIndex] = useState("1");
  const [category, setCategory] = useState("general");

  const createListening = useCreateListening();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!level) return;

    await createListening.mutateAsync({
      title,
      level: level as Level,
      description,
      audio_url: audioUrl,
      transcript,
      duration_seconds: parseInt(duration),
      is_premium: isPremium,
      order_index: parseInt(orderIndex),
      category,
      updated_at: new Date().toISOString(),
    });

    // Reset form
    setTitle("");
    setLevel("");
    setDescription("");
    setAudioUrl("");
    setTranscript("");
    setDuration("");
    setIsPremium(false);
    setOrderIndex("1");
    setCategory("general");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Listening Content</DialogTitle>
          <DialogDescription>
            Create a new audio listening exercise
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
                placeholder="e.g., A Weekend Trip"
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the audio content..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., conversation, news, story"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audioUrl">Audio URL *</Label>
              <Input
                id="audioUrl"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://example.com/audio.mp3"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (seconds) *</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="180"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transcript">Transcript *</Label>
            <Textarea
              id="transcript"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Full transcript of the audio..."
              rows={8}
              required
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
              disabled={createListening.isPending}
            >
              {createListening.isPending ? "Creating..." : "Create Listening"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
