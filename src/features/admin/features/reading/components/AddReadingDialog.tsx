"use client";

import { useEffect, useState } from "react";
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
import { useCreateReading } from "../hooks";
import { Level } from "@/shared/types/common.types";
import { uploadAudioAsset } from "@/shared/services/audioUploadService";
import { QuestionManager, Question } from "./QuestionManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { QuestionFormData, readingFormSchema, type ReadingFormData } from "../types/validation";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

interface AddReadingDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddReadingDialog({ open, onClose }: AddReadingDialogProps) {
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
  const [isUploading, setIsUploading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const createReading = useCreateReading();
  useEffect(() => {
    form.setValue("questions", questions as QuestionFormData[], { shouldDirty: true });
  }, [questions, form]);

  const onSubmitForm = async (data: ReadingFormData) => {
    let audioAssetId: string | undefined = undefined;

    if (audioFile) {
      try {
        setIsUploading(true);

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

    await createReading.mutateAsync({
      title: data.title,
      level: data.level as Level,
      content: data.content,
      audio_asset_id: audioAssetId,
      is_premium: !!data.is_premium,
      order_index: Number(data.order_index || 1),
      updated_at: new Date().toISOString(),
      questions,
    });

    form.reset({
      title: "",
      level: "B1",
      content: "",
      is_premium: false,
      order_index: 1,
      updated_at: new Date().toISOString(),
      questions: [],
    });
    setAudioFile(null);
    setQuestions([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-0">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input id="title" placeholder="e.g., My Daily Routine" className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2 ">
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level *</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={(val) => field.onChange(val as Level)}>
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
                        <FormLabel>Content *</FormLabel>
                      <FormControl>
                        <Textarea id="content" placeholder="Enter the reading text (use double line breaks for paragraphs)..." className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300" rows={12} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
                  <FormField
                    control={form.control}
                    name="order_index"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Index</FormLabel>
                        <FormControl>
                          <Input id="orderIndex" type="number" className="rounded-2xl border-2 border-gray-200 dark:border-gray-700" value={Number(field.value ?? 1)} min={1} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
