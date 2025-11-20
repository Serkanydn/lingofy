"use client";

import { useState, useEffect } from "react";
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
import { ChevronDown, ChevronUp, Upload, X, AlertCircle } from "lucide-react";
import { uploadAudioAsset } from "@/shared/services/audioUploadService";
import { readingFormSchema, type ReadingFormData } from "../types/validation";
import { CEFRLevel } from "@/shared/types/enums/cefrLevel.enum";
import { LEVELS } from "@/shared/types/model/level";
import { QuestionManager } from "@/features/admin/shared/components/questionManager";


interface ReadingFormProps {
  isOpen: boolean;
  onToggle: () => void;
  onSubmit: (data: ReadingFormData) => Promise<void>;
  initialData?: Partial<ReadingFormData>;
  isLoading?: boolean;
  mode?: "create" | "edit";
}



export function ReadingForm({
  isOpen,
  onToggle,
  onSubmit,
  initialData,
  isLoading = false,
  mode = "create",
}: ReadingFormProps) {
  const form = useForm<ReadingFormData>({
    resolver: zodResolver(readingFormSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      title: initialData?.title ?? "",
      level: initialData?.level ?? CEFRLevel.A1,
      content: initialData?.content ?? "",
      is_premium: initialData?.is_premium ?? false,
      order: initialData?.order ?? 1,
      audio_asset_id: initialData?.audio_asset_id,
      questions: initialData?.questions ?? [],
    },
  });
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue, trigger } = form;
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      console.log("[ReadingForm] Received initialData", initialData);
      reset({
        title: initialData.title ?? "",
        level: initialData.level ?? CEFRLevel.A1,
        content: initialData.content ?? "",
        is_premium: initialData.is_premium ?? false,
        order: initialData.order ?? 1,
        audio_asset_id: initialData.audio_asset_id,
        questions: initialData.questions ?? [],
        audio_asset: initialData?.audio_asset,
      });
    }
  }, [initialData, reset]);


  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log("[ReadingForm] Selected audio file", e.target.files[0]);
      setAudioFile(e.target.files[0]);
    }
  };

  const handleRemoveAudio = () => {
    console.log("[ReadingForm] Removing selected local audio file");
    setAudioFile(null);
    setValue("audio_asset_id", undefined, { shouldValidate: true });
  };

  const handleRemoveAudioAsset = () => {
    console.log("[ReadingForm] Clearing existing audio asset from form");
    setValue("audio_asset_id", undefined, { shouldValidate: true });
    setValue("audio_asset", undefined, { shouldValidate: true });
    // Also clear the local file so the UI stays consistent
    setAudioFile(null);
  };

  const onInvalidSubmit = (invalidErrors: any) => {
    console.error("[ReadingForm] Validation failed", invalidErrors);
    alert("Please fix validation errors before submitting.");
  };

  const onSubmitForm = async (data: ReadingFormData) => {
    console.log("[ReadingForm] Submit triggered", { mode, data });
    let audioAssetId = data.audio_asset_id;
    if (audioFile) {
      try {
        setIsUploading(true);
        console.log("[ReadingForm] Uploading audio file...");
        const result = await uploadAudioAsset({ file: audioFile, contentType: "reading" });
        if (!result.success || !result.audioAsset) {
          alert(`Failed to upload audio file: ${result.error || "Unknown error"}`);
          setIsUploading(false);
          return;
        }
        console.log("[ReadingForm] Audio upload success", result.audioAsset);
        audioAssetId = result.audioAsset.id;
      } catch (error) {
        console.error("[ReadingForm] Audio upload error", error);
        alert(`Failed to upload audio file: ${error instanceof Error ? error.message : "Unknown error"}`);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }
    try {
      const questionsPayload = watch("questions") || [];
      console.log("[ReadingForm] Calling parent onSubmit with payload", { ...data, audio_asset_id: audioAssetId, questions: questionsPayload });
      await onSubmit({ ...data, audio_asset_id: audioAssetId, questions: questionsPayload });
      if (mode === "create") {
        console.log("[ReadingForm] Create mode: resetting form while keeping it open");
        reset();
        setAudioFile(null);
      }
    } catch (e) {
      console.error("[ReadingForm] Submit error", e);
      alert("Failed to save reading. Please try again or check connectivity/permissions.");
    }
  };

  const handleReset = () => {
    reset();
    setAudioFile(null);
  };

  return (
    <Card className="mb-6 rounded-3xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300">
      {/* Header - Always Visible */}
      <div
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(34,197,94,0.4)]">
            <span className="text-2xl">📖</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === "create" ? "Add New Reading" : "Edit Reading"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isOpen ? "Click to collapse" : "Click to expand the form"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-xl">
          {isOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Form Content - Collapsible */}
      {isOpen && (
        <CardContent className="pt-0 pb-6 border-t border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSubmit(onSubmitForm, onInvalidSubmit)} className="space-y-6 mt-6" noValidate>
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-gray-100 dark:bg-gray-800 p-1">
                <TabsTrigger value="content" className="rounded-xl">
                  Content Details
                </TabsTrigger>
                <TabsTrigger value="questions" className="rounded-xl">
                  Questions ({(watch("questions") || []).length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6 mt-6">
                {/* Title & Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-semibold">
                      Title *
                    </Label>
                    <Input
                      id="title"
                      {...register("title")}
                      placeholder="e.g., My Daily Routine"
                      className={`rounded-2xl border-2 h-12 ${errors.title ? "border-red-500" : ""}`}
                      onBlur={() => trigger("title")}
                      aria-invalid={errors.title ? "true" : "false"}
                      aria-describedby={errors.title ? "title-error" : undefined}
                    />
                    {errors.title && (
                      <span id="title-error" role="alert" className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.title.message as string}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level" className="text-sm font-semibold">
                      Level *
                    </Label>
                    <Select value={watch("level")} onValueChange={(value) => setValue("level", value as CEFRLevel, { shouldValidate: true })}>
                      <SelectTrigger className={`rounded-2xl border-2 h-12 ${errors.level ? "border-red-500" : ""}`} onBlur={() => trigger("level")}>
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
                    {errors.level && (
                      <span role="alert" className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.level.message as string}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-semibold">
                    Reading Content *
                  </Label>
                  <Textarea
                    id="content"
                    {...register("content")}
                    placeholder="Enter the reading passage text..."
                    className={`rounded-2xl border-2 resize-none min-h-[200px] ${errors.content ? "border-red-500" : ""}`}
                    onBlur={() => trigger("content")}
                    aria-invalid={errors.content ? "true" : "false"}
                    aria-describedby={errors.content ? "content-error" : undefined}
                  />
                  {errors.content && (
                    <span id="content-error" role="alert" className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.content.message as string}
                    </span>
                  )}
                </div>

                {/* Audio Upload */}
                <div className="space-y-2">
                  <Label htmlFor="audio" className="text-sm font-semibold">
                    Audio File (Optional)
                  </Label>
                  {watch("audio_asset") && (
                    <div className="flex items-center gap-2 p-4 rounded-2xl border-2 border-green-200 bg-green-50 dark:bg-green-900/10">
                      <span className="flex-1 text-sm">{watch("audio_asset")?.original_filename}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveAudioAsset}
                        className="rounded-xl"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>)}
                  {!watch("audio_asset") && audioFile && (
                    <div className="flex items-center gap-2 p-4 rounded-2xl border-2 border-green-200 bg-green-50 dark:bg-green-900/10">
                      <span className="flex-1 text-sm">{audioFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveAudio}
                        className="rounded-xl"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>)}

                  {!watch("audio_asset") && !audioFile &&
                    <div className="relative">
                      <Input
                        id="audio"
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioFileChange}
                        className="hidden"
                      />
                      <Label
                        htmlFor="audio"
                        className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-green-400 cursor-pointer transition-colors"
                      >
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Click to upload audio file
                        </span>
                      </Label>
                    </div>}
                </div>

                {/* Order & Premium */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderIndex" className="text-sm font-semibold">
                      Display Order
                    </Label>
                    <Input
                      id="orderIndex"
                      type="number"
                      {...register("order", { valueAsNumber: true })}
                      className={`rounded-2xl border-2 h-12 ${errors.order ? "border-red-500" : ""}`}
                      onBlur={() => trigger("order")}
                      min="1"
                    />
                    {errors.order && (
                      <span role="alert" className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.order.message as string}
                      </span>
                    )}
                  </div>

                  <div className="flex items-end">
                    <div className="flex items-center space-x-3 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 border-2 border-amber-100 dark:border-amber-900/30 w-full">
                      <input
                        type="checkbox"
                        id="isPremium"
                        checked={watch("is_premium")}
                        onChange={(e) => setValue("is_premium", e.target.checked, { shouldValidate: true })}
                        className="h-5 w-5 rounded-lg border-2 border-amber-300 text-amber-500 focus:ring-amber-500"
                      />
                      <Label
                        htmlFor="isPremium"
                        className="text-sm font-semibold text-amber-700 dark:text-amber-400 cursor-pointer"
                      >
                        ⭐ Premium Content
                      </Label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="questions" className="mt-6" onBlur={() => trigger("questions")}>
                <div className={`${errors.questions ? "border-2 border-red-500 rounded-2xl p-2" : ""}`}>
                  <QuestionManager
                    questions={watch("questions")?.map(q => ({ ...q, options: q.options ?? [] })) || []}
                    onChange={(questions) => setValue("questions", questions as ReadingFormData["questions"], { shouldValidate: true })}
                  />
                </div>
                {errors.questions && (
                  <div role="alert" className="text-xs text-red-600 flex items-center gap-1 mt-2">
                    <AlertCircle className="h-4 w-4" />
                    Exactly one option must be marked correct for multiple-choice questions
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleReset();
                  if (mode !== "create") onToggle();
                }}
                className="flex-1 rounded-2xl border-2 h-12"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-2xl h-12 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-[0_4px_14px_rgba(34,197,94,0.4)]"
                disabled={isLoading || isUploading}
              >
                {isUploading ? "Uploading..." : isLoading ? "Saving..." : mode === "create" ? "Create Reading" : "Update Reading"}
              </Button>
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
