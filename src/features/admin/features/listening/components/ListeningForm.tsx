"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, Upload, X } from "lucide-react";
import { Level } from "@/shared/types/common.types";
import { uploadAudioAsset } from "@/shared/services/audioUploadService";
import { QuestionManager, type Question } from "./QuestionManager";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { levelSchema, questionSchema } from "../types/validation";
import { toast } from "sonner";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

type ListeningFormValues = z.infer<typeof listeningFormUiSchema>;

interface ListeningFormProps {
  isOpen: boolean;
  onToggle: () => void;
  onSubmit: (data: ListeningFormValues & { audio_asset_id: string }) => Promise<void>;
  initialData?: Partial<ListeningFormValues>;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

const listeningFormUiSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  level: levelSchema,
  transcript: z.string().min(20).trim(),
  duration: z
    .union([z.coerce.number().int().positive().max(3600), z.literal(0)])
    .optional(),
  is_premium: z.boolean(),
  order_index: z.coerce.number().int().positive(),
  audio_asset_id: z.string().uuid().optional(),
  questions: z.array(questionSchema).default([]),
});

export function ListeningForm({
  isOpen,
  onToggle,
  onSubmit,
  initialData,
  isLoading = false,
  mode = "create",
}: ListeningFormProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const defaultValues = useMemo<Partial<ListeningFormValues>>(
    () => ({
      title: "",
      level: "A1",
      transcript: "",
      duration: undefined,
      is_premium: false,
      order_index: 1,
      questions: [],
      ...initialData,
    }),
    [initialData]
  );

  const form = useForm<ListeningFormValues>({
    resolver: zodResolver(listeningFormUiSchema) as any,
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (initialData) {
      form.reset(defaultValues);
    }
  }, [initialData, form, defaultValues]);

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleRemoveAudio = () => {
    setAudioFile(null);
    form.setValue("audio_asset_id", undefined);
  };

  const onSubmitForm = async (values: ListeningFormValues) => {
    let audioAssetId = values.audio_asset_id;
    if (!audioAssetId && !audioFile) {
      toast.error("Audio file is required for listening content");
      return;
    }
    if (audioFile) {
      try {
        setIsUploading(true);
        const result = await uploadAudioAsset({ file: audioFile, contentType: "listening" });
        if (!result.success || !result.audioAsset) {
          toast.error(result.error || "Failed to upload audio file");
          setIsUploading(false);
          return;
        }
        audioAssetId = result.audioAsset.id;
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Failed to upload audio file";
        toast.error(msg);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }
    if (!audioAssetId) {
      toast.error("Audio file is required");
      return;
    }
    const payload: ListeningFormValues & { audio_asset_id: string } = {
      ...values,
      audio_asset_id: audioAssetId,
    };
    await onSubmit(payload);
  };

  return (
    <Card className="mb-6 rounded-3xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300">
      <div
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(59,130,246,0.4)]">
            <span className="text-2xl">🎧</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === "create" ? "Add New Listening" : "Edit Listening"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isOpen ? "Click to collapse" : "Click to expand the form"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-xl">
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>

      {isOpen && (
        <CardContent className="pt-0 pb-6 border-t border-gray-200 dark:border-gray-800">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6 mt-6" noValidate>
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-gray-100 dark:bg-gray-800 p-1">
                  <TabsTrigger value="content" className="rounded-xl">Content Details</TabsTrigger>
                  <TabsTrigger value="questions" className="rounded-xl">
                    Questions {(form.watch("questions") || []).length}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Airport Conversation" className="rounded-2xl border-2 h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">Level</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={(v) => field.onChange(v as Level)}>
                              <SelectTrigger className="rounded-2xl border-2 h-12">
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

                  <div className="space-y-2">
                    <Label htmlFor="audio" className="text-sm font-semibold">Audio File</Label>
                    {audioFile || form.getValues("audio_asset_id") ? (
                      <div className="flex items-center gap-2 p-4 rounded-2xl border-2 border-blue-200 bg-blue-50 dark:bg-blue-900/10">
                        <span className="flex-1 text-sm">{audioFile ? audioFile.name : "Audio file uploaded"}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={handleRemoveAudio} className="rounded-xl">
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <Input id="audio" type="file" accept="audio/*" onChange={handleAudioFileChange} className="hidden" />
                        <Label htmlFor="audio" className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-blue-300 hover:border-blue-400 cursor-pointer transition-colors">
                          <Upload className="h-5 w-5 text-blue-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Click to upload audio file</span>
                        </Label>
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="transcript"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Transcript</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter the audio transcript..." className="rounded-2xl border-2 resize-none min-h-[200px]" rows={6} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">Duration (seconds)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              placeholder="e.g., 120"
                              className="rounded-2xl border-2 h-12"
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="order_index"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">Display Order</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              className="rounded-2xl border-2 h-12"
                              value={field.value}
                              onChange={(e) => field.onChange(Number(e.target.value || 1))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="is_premium"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">Premium</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 border-2 border-amber-100 dark:border-amber-900/30 w-full">
                              <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} className="h-5 w-5 rounded-lg border-2 border-amber-300 text-amber-500 focus:ring-amber-500" />
                              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">⭐ Premium</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="questions" className="mt-6">
                  <QuestionManager
                    questions={(form.watch("questions") || []) as unknown as Question[]}
                    onChange={(qs: Question[]) => form.setValue("questions", qs as any, { shouldValidate: true })}
                  />
                </TabsContent>
              </Tabs>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button type="button" variant="outline" onClick={() => { form.reset(defaultValues); setAudioFile(null); onToggle(); }} className="flex-1 rounded-2xl border-2 h-12">Cancel</Button>
                <Button type="submit" className="flex-1 rounded-2xl h-12 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-[0_4px_14px_rgba(59,130,246,0.4)]" disabled={isLoading || isUploading || form.formState.isSubmitting}>
                  {isUploading ? "Uploading..." : isLoading || form.formState.isSubmitting ? "Saving..." : mode === "create" ? "Create Listening" : "Update Listening"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      )}
    </Card>
  );
}
