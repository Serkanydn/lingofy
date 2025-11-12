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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUpdateListening } from "@/features/admin/hooks/useListeningContent";
import { useListeningQuestions } from "@/features/listening/hooks/useListening";
import { Level } from "@/shared/types/common.types";
import { ListeningExercise } from "@/features/listening/types/service.types";
import { QuestionManager, Question } from "./QuestionManager";

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
  const [transcript, setTranscript] = useState("");
  const [durationSeconds, setDurationSeconds] = useState("0");
  const [orderIndex, setOrderIndex] = useState("1");
  const [isPremium, setIsPremium] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const updateListening = useUpdateListening();

  // Fetch questions using React Query hook
  const {
    data: fetchedQuestions,
    isLoading: isLoadingQuestions,
    error: questionsError,
  } = useListeningQuestions(listening?.id || "", open && !!listening?.id);

  useEffect(() => {
    if (listening && open) {
      setTitle(listening.title);
      setLevel(listening.level);
      setDescription(listening.description || "");
      setTranscript(listening.transcript || "");
      setDurationSeconds(String(listening.duration_seconds));
      setOrderIndex(String(listening.order_index));
      setIsPremium(listening.is_premium);
    }

    // Reset state when dialog closes
    if (!open) {
      setQuestions([]);
    }
  }, [listening, open]);

  // Update local questions state when fetched questions change
  useEffect(() => {
    if (fetchedQuestions) {
      setQuestions(fetchedQuestions);
    }
  }, [fetchedQuestions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!listening) return;

    await updateListening.mutateAsync({
      id: listening.id,
      data: {
        title,
        level: level as Level,
        description,
        transcript,
        duration_seconds: parseInt(durationSeconds),
        order_index: parseInt(orderIndex),
        is_premium: isPremium,
        updated_at: new Date().toISOString(),
      },
      questions,
    });

    onClose();
  };

  if (!listening) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-0">
        <DialogHeader className="space-y-4 pb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(168,85,247,0.4)]">
            <span className="text-4xl">🎧</span>
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Edit Listening Content
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-400">
            Update the audio lesson details and comprehension questions
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
                <Label htmlFor="audioAsset">Audio Asset</Label>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
                  {listening.audio_asset ? (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {listening.audio_asset.cdn_url ? '🌐 CDN' : '💾 Storage'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Duration: {listening.audio_asset.duration_seconds}s
                      </p>
                      {listening.audio_asset.format && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Format: {listening.audio_asset.format}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No audio asset linked</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="durationSeconds">Duration (seconds) *</Label>
                  <Input
                    id="durationSeconds"
                    type="number"
                    value={durationSeconds}
                    onChange={(e) => setDurationSeconds(e.target.value)}
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
