"use client";

import { useState, useEffect } from "react";
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

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

interface ListeningFormProps {
  isOpen: boolean;
  onToggle: () => void;
  onSubmit: (data: ListeningFormData) => Promise<void>;
  initialData?: Partial<ListeningFormData>;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export interface ListeningFormData {
  title: string;
  level: Level;
  transcript: string;
  audio_asset_id: string;
  duration?: number;
  is_premium: boolean;
  order_index: number;
  questions: Question[];
}

export function ListeningForm({
  isOpen,
  onToggle,
  onSubmit,
  initialData,
  isLoading = false,
  mode = "create",
}: ListeningFormProps) {
  const [formData, setFormData] = useState<Omit<ListeningFormData, "audio_asset_id"> & { audio_asset_id?: string }>({
    title: "",
    level: "A1",
    transcript: "",
    duration: undefined,
    is_premium: false,
    order_index: 1,
    questions: [],
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (field: keyof ListeningFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleRemoveAudio = () => {
    setAudioFile(null);
    handleChange("audio_asset_id", undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let audioAssetId = formData.audio_asset_id;

    // Audio is required for listening
    if (!audioAssetId && !audioFile) {
      alert("Audio file is required for listening content");
      return;
    }

    // Upload audio file if provided
    if (audioFile) {
      try {
        setIsUploading(true);
        const result = await uploadAudioAsset({
          file: audioFile,
          contentType: "listening",
        });

        if (!result.success || !result.audioAsset) {
          alert(`Failed to upload audio file: ${result.error || "Unknown error"}`);
          setIsUploading(false);
          return;
        }

        audioAssetId = result.audioAsset.id;
      } catch (error) {
        console.error("Audio upload error:", error);
        alert(`Failed to upload audio file: ${error instanceof Error ? error.message : "Unknown error"}`);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    if (!audioAssetId) {
      alert("Audio file is required");
      return;
    }

    await onSubmit({
      ...formData,
      audio_asset_id: audioAssetId,
    } as ListeningFormData);
  };

  const handleReset = () => {
    setFormData({
      title: "",
      level: "A1",
      transcript: "",
      duration: undefined,
      is_premium: false,
      order_index: 1,
      questions: [],
    });
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
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-gray-100 dark:bg-gray-800 p-1">
                <TabsTrigger value="content" className="rounded-xl">
                  Content Details
                </TabsTrigger>
                <TabsTrigger value="questions" className="rounded-xl">
                  Questions ({formData.questions.length})
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
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="e.g., Airport Conversation"
                      className="rounded-2xl border-2 h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level" className="text-sm font-semibold">
                      Level *
                    </Label>
                    <Select value={formData.level} onValueChange={(value) => handleChange("level", value)}>
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
                  </div>
                </div>

                {/* Audio Upload - Required */}
                <div className="space-y-2">
                  <Label htmlFor="audio" className="text-sm font-semibold">
                    Audio File * (Required)
                  </Label>
                  {audioFile || formData.audio_asset_id ? (
                    <div className="flex items-center gap-2 p-4 rounded-2xl border-2 border-blue-200 bg-blue-50 dark:bg-blue-900/10">
                      <span className="flex-1 text-sm">
                        {audioFile ? audioFile.name : "Audio file uploaded"}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveAudio}
                        className="rounded-xl"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Input
                        id="audio"
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioFileChange}
                        className="hidden"
                        required={mode === "create"}
                      />
                      <Label
                        htmlFor="audio"
                        className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-blue-300 hover:border-blue-400 cursor-pointer transition-colors"
                      >
                        <Upload className="h-5 w-5 text-blue-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Click to upload audio file (required)
                        </span>
                      </Label>
                    </div>
                  )}
                </div>

                {/* Transcript */}
                <div className="space-y-2">
                  <Label htmlFor="transcript" className="text-sm font-semibold">
                    Transcript *
                  </Label>
                  <Textarea
                    id="transcript"
                    value={formData.transcript}
                    onChange={(e) => handleChange("transcript", e.target.value)}
                    placeholder="Enter the audio transcript..."
                    className="rounded-2xl border-2 resize-none min-h-[200px]"
                    required
                  />
                </div>

                {/* Duration, Order & Premium */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-sm font-semibold">
                      Duration (seconds)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration || ""}
                      onChange={(e) => handleChange("duration", e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="e.g., 120"
                      className="rounded-2xl border-2 h-12"
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orderIndex" className="text-sm font-semibold">
                      Display Order
                    </Label>
                    <Input
                      id="orderIndex"
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => handleChange("order_index", parseInt(e.target.value) || 1)}
                      className="rounded-2xl border-2 h-12"
                      min="1"
                    />
                  </div>

                  <div className="flex items-end">
                    <div className="flex items-center space-x-3 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 border-2 border-amber-100 dark:border-amber-900/30 w-full">
                      <input
                        type="checkbox"
                        id="isPremium"
                        checked={formData.is_premium}
                        onChange={(e) => handleChange("is_premium", e.target.checked)}
                        className="h-5 w-5 rounded-lg border-2 border-amber-300 text-amber-500 focus:ring-amber-500"
                      />
                      <Label
                        htmlFor="isPremium"
                        className="text-sm font-semibold text-amber-700 dark:text-amber-400 cursor-pointer"
                      >
                        ⭐ Premium
                      </Label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="questions" className="mt-6">
                <QuestionManager
                  questions={formData.questions}
                  onChange={(questions: Question[]) => handleChange("questions", questions)}
                />
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleReset();
                  onToggle();
                }}
                className="flex-1 rounded-2xl border-2 h-12"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-2xl h-12 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-[0_4px_14px_rgba(59,130,246,0.4)]"
                disabled={isLoading || isUploading}
              >
                {isUploading ? "Uploading..." : isLoading ? "Saving..." : mode === "create" ? "Create Listening" : "Update Listening"}
              </Button>
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
