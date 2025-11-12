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
import { uploadAudioAsset } from "@/shared/services/audioUploadService";
import { QuestionManager, Question } from "./QuestionManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

interface AddListeningDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddListeningDialog({ open, onClose }: AddListeningDialogProps) {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<string>("");
  const [description, setDescription] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [duration, setDuration] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [orderIndex, setOrderIndex] = useState("1");
  const [isUploading, setIsUploading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const createListening = useCreateListening();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!level || !audioFile) return;

    let audioAssetId: string | undefined = undefined;

    // Upload audio file
    try {
      setIsUploading(true);

      // Use the new audio asset upload service
      const result = await uploadAudioAsset({
        file: audioFile,
        contentType: "listening",
      });

      if (!result.success || !result.audioAsset) {
        throw new Error(result.error || "Failed to upload audio");
      }

      audioAssetId = result.audioAsset.id;
    } catch (error) {
      console.error("Audio upload error:", error);
      alert("Failed to upload audio file. Please try again.");
      setIsUploading(false);
      return;
    } finally {
      setIsUploading(false);
    }

    await createListening.mutateAsync({
      title,
      level: level as Level,
      description,
      audio_asset_id: audioAssetId,
      transcript,
      duration_seconds: parseInt(duration),
      is_premium: isPremium,
      order_index: parseInt(orderIndex),
      updated_at: new Date().toISOString(),
      questions,
    });

    // Reset form
    setTitle("");
    setLevel("");
    setDescription("");
    setAudioFile(null);
    setTranscript("");
    setDuration("");
    setIsPremium(false);
    setOrderIndex("1");
    setQuestions([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-0">
        <DialogHeader className="space-y-4 pb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(168,85,247,0.4)]">
            <span className="text-4xl">🎧</span>
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Add Listening Content
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-400">
            Create a new audio listening exercise with comprehension questions
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-gray-100 dark:bg-gray-800 p-1">
              <TabsTrigger value="content" className="rounded-xl">
                Content Details
              </TabsTrigger>
              <TabsTrigger value="questions" className="rounded-xl">
                Questions ({questions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., A Weekend Trip"
                    className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
                    required
                  />
                </div>

                <div className="space-y-2">
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the audio content..."
                  className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audioFile">Audio File *</Label>
                <Input
                  id="audioFile"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                  className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-orange-900/20 dark:file:text-orange-400"
                  required
                />
                {audioFile && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {audioFile.name} (
                    {(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
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
                    className="rounded-2xl border-2 border-gray-200 dark:border-gray-700"
                    required
                  />
                </div>

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
              </div>

              <div className="space-y-2">
                <Label htmlFor="transcript">Transcript *</Label>
                <Textarea
                  id="transcript"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Full transcript of the audio..."
                  className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
                  rows={8}
                  required
                />
              </div>

              <div className="flex items-center space-x-3 p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-900/10 border-2 border-orange-100 dark:border-orange-900/30">
                <Checkbox
                  id="isPremium"
                  checked={isPremium}
                  onCheckedChange={(checked) =>
                    setIsPremium(checked as boolean)
                  }
                  className="h-5 w-5 rounded-lg border-2 border-orange-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />
                <Label
                  htmlFor="isPremium"
                  className="text-sm font-semibold text-orange-700 dark:text-orange-400 cursor-pointer flex items-center gap-2"
                >
                  <span>👑</span> Premium Content
                </Label>
              </div>
            </TabsContent>

            <TabsContent value="questions" className="mt-6">
              <QuestionManager questions={questions} onChange={setQuestions} />
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
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
              disabled={createListening.isPending || isUploading}
            >
              {isUploading
                ? "Uploading Audio..."
                : createListening.isPending
                ? "Creating..."
                : "Create Listening"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
