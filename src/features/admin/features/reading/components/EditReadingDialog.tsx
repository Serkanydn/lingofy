"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useUpdateReading } from "../hooks";
import { useReadingQuestions } from "@/features/reading/hooks/useReading";
import { Level } from "@/shared/types/common.types";
import { ReadingText, type ReadingQuestionInput } from "@/features/reading/types/service.types";
import { QuestionManager, Question } from "./QuestionManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { readingFormSchema, type ReadingFormData, type QuestionFormData } from "../types/validation";

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
  const form = useForm<ReadingFormData>({
    resolver: zodResolver(readingFormSchema),
    defaultValues: {
      title: "",
      level: "B1",
      content: "",
      is_premium: false,
      order_index: 1,
      updated_at: new Date().toISOString(),
      questions: [],
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const updateReading = useUpdateReading();

  // Fetch questions using React Query hook
  const {
    data: fetchedQuestions,
    isLoading: isLoadingQuestions,
    error: questionsError,
  } = useReadingQuestions(reading?.id || "", open && !!reading?.id);

  useEffect(() => {
    if (reading && open) {
      console.log('Reading data in dialog:', reading);
      console.log('Audio asset:', reading.audio_asset);
      console.log('Audio asset ID:', reading.audio_asset_id);

      form.reset({
        title: reading.title,
        level: reading.level,
        content: reading.content,
        is_premium: reading.is_premium,
        order_index: reading.order_index,
        updated_at: new Date().toISOString(),
        questions: [],
      });
      const audioUrl = reading.audio_asset?.cdn_url || reading.audio_asset?.storage_url || "";
      console.log('Resolved audio URL:', audioUrl);
      setCurrentAudioUrl(audioUrl);
      setAudioFile(null);
    }

    // Reset state when dialog closes
    if (!open) {
      setQuestions([]);
      setCurrentAudioUrl("");
    }
  }, [reading, open]);

  // Update local questions state when fetched questions change
  useEffect(() => {
    if (fetchedQuestions) {
      setQuestions(fetchedQuestions);
    }
  }, [fetchedQuestions]);

  useEffect(() => {
    form.setValue("questions", questions as QuestionFormData[], { shouldDirty: true });
  }, [questions, form]);

  const onSubmitForm = async (data: ReadingFormData) => {
    if (!reading) return;

    let audioAssetId: string | undefined = reading.audio_asset_id;

    if (audioFile) {
      try {
        setIsUploading(true);

        const { uploadAudioAsset } = await import("@/shared/services/audioUploadService");

        const result = await uploadAudioAsset({
          file: audioFile,
          contentType: "reading",
        });

        if (!result.success || !result.audioAsset) {
          const errorMsg = result.error || "Failed to upload audio";
          alert(`Failed to upload audio file: ${errorMsg}`);
          setIsUploading(false);
          return;
        }

        audioAssetId = result.audioAsset.id;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        alert(`Failed to upload audio file: ${errorMsg}`);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const mappedQuestions: ReadingQuestionInput[] = questions.map((q) => ({
      text: q.text,
      type: q.type,
      options: Array.isArray(q.options) ? q.options : [],
      correct_answer: q.type === "fill_blank" ? (q.correct_answer ?? "") : undefined,
      points: q.points,
      order_index: q.order_index,
    }));

    await updateReading.mutateAsync({
      id: reading.id,
      data: {
        title: data.title,
        level: data.level as Level,
        content: data.content,
        audio_asset_id: audioAssetId,
        order_index: Number(data.order_index || 1),
        is_premium: !!data.is_premium,
        content_id: reading.content_id,
        updated_at: new Date().toISOString(),
      },
      questions: mappedQuestions,
    });

    onClose();
  };

  if (!reading) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-0">
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6" noValidate>
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
              <div className="flex justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Title *</FormLabel>
                        <FormControl>
                          <Input id="title" placeholder="e.g., The History of Coffee" className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2 flex-1">
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Level *</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={(val) => field.onChange(val as Level)}>
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Reading Text *</FormLabel>
                      <FormControl>
                        <Textarea id="content" placeholder="Enter the reading text..." rows={12} className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
                      New: {audioFile.name} (
                      {(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  ) : currentAudioUrl ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Current: {currentAudioUrl.includes('/') ? currentAudioUrl.split("/").pop() : 'Audio file exists'}
                    </p>
                  ) : reading?.audio_asset_id ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Audio asset ID: {reading.audio_asset_id.substring(0, 8)}...
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      No audio file
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="order_index"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Order Index</FormLabel>
                        <FormControl>
                          <Input id="orderIndex" type="number" min="1" className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300" value={Number(field.value ?? 1)} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-900/10 border-2 border-orange-100 dark:border-orange-900/30">
                <FormField
                  control={form.control}
                  name="is_premium"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormControl>
                        <input
                          type="checkbox"
                          id="isPremium"
                          className="h-5 w-5 rounded-lg border-2 border-orange-300 text-orange-500 focus:ring-orange-500"
                          checked={!!field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      </FormControl>
                      <Label
                        htmlFor="isPremium"
                        className="text-sm font-semibold text-orange-700 dark:text-orange-400 cursor-pointer flex items-center gap-2"
                      >
                        <span>👑</span> Premium Content
                      </Label>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="questions" className="mt-6">
              {isLoadingQuestions ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                  <p className="text-gray-600 dark:text-gray-400 animate-pulse">
                    Loading questions...
                  </p>
                </div>
              ) : questionsError ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <span className="text-3xl">⚠️</span>
                  </div>
                  <p className="text-red-600 dark:text-red-400">
                    Failed to load questions
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {questionsError instanceof Error
                      ? questionsError.message
                      : "Unknown error"}
                  </p>
                </div>
              ) : (
                <QuestionManager
                  questions={questions}
                  onChange={setQuestions}
                />
              )}
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setAudioFile(null);
                setQuestions([]);
                onClose();
              }}
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
