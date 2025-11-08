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
import { useUpdateListening } from "@/features/admin/hooks/useListeningContent";
import { Level } from "@/shared/types/common.types";
import { ListeningExercise } from "@/features/listening/types/service.types";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

interface EditListeningDialogProps {
  open: boolean;
  onClose: () => void;
  listening: ListeningExercise | null;
}

export function EditListeningDialog({ open, onClose, listening }: EditListeningDialogProps) {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<string>("B1");
  const [description, setDescription] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [durationSeconds, setDurationSeconds] = useState("0");
  const [orderIndex, setOrderIndex] = useState("1");
  const [isPremium, setIsPremium] = useState(false);
  const [category, setCategory] = useState("general");

  const updateListening = useUpdateListening();

  useEffect(() => {
    if (listening) {
      setTitle(listening.title);
      setLevel(listening.level);
      setDescription(listening.description || "");
      setAudioUrl(listening.audio_url);
      setTranscript(listening.transcript || "");
      setDurationSeconds(String(listening.duration_seconds));
      setOrderIndex(String(listening.order_index));
      setIsPremium(listening.is_premium);
      setCategory(listening.category || "general");
    }
  }, [listening]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!listening) return;

    await updateListening.mutateAsync({
      id: listening.id,
      data: {
        title,
        level: level as Level,
        description,
        audio_url: audioUrl,
        transcript,
        duration_seconds: parseInt(durationSeconds),
        order_index: parseInt(orderIndex),
        is_premium: isPremium,
        category,
        updated_at: new Date().toISOString(),
      },
    });

    onClose();
  };

  if (!listening) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Listening Content</DialogTitle>
          <DialogDescription>
            Update the audio lesson details
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
                placeholder="e.g., A Conversation at a Cafe"
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
              <Label htmlFor="audioUrl">Audio URL *</Label>
              <Input
                id="audioUrl"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationSeconds">Duration (seconds) *</Label>
              <Input
                id="durationSeconds"
                type="number"
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(e.target.value)}
                min="1"
                required
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the audio content..."
              rows={3}
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

          <div className="space-y-2">
            <Label htmlFor="transcript">Transcript *</Label>
            <Textarea
              id="transcript"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Full transcript of the audio..."
              rows={10}
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
              disabled={updateListening.isPending}
            >
              {updateListening.isPending ? "Updating..." : "Update Listening"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
