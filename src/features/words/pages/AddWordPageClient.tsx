"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ArrowLeft, Save, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useAddWord,
  useWordCategories,
  useAssignWordToCategory,
} from "../hooks/useWords";

export function AddWordPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialWord = searchParams.get("word") || "";
  const sourceType = searchParams.get("sourceType") as "reading" | "listening" | undefined;
  const sourceId = searchParams.get("sourceId") || undefined;
  const initialCategoryId = searchParams.get("categoryId") || null;

  const [word, setWord] = useState(initialWord);
  const [description, setDescription] = useState("");
  const [exampleSentences, setExampleSentences] = useState<string[]>([""]);
  const [categoryId, setCategoryId] = useState<string>("none");
  
  const addWord = useAddWord();
  const assignToCategory = useAssignWordToCategory();
  const { data: categories } = useWordCategories();

  useEffect(() => {
    setWord(initialWord);
    setCategoryId(initialCategoryId || "none");
  }, [initialWord, initialCategoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !word ||
      !description ||
      exampleSentences.filter((s) => s.trim()).length === 0
    ) {
      toast.error(
        "Please fill in all required fields and at least one example"
      );
      return;
    }

    try {
      const newWord = await addWord.mutateAsync({
        word,
        description,
        example_sentences: exampleSentences.filter((s) => s.trim()),
        source_type: sourceType,
        source_id: sourceId,
      });

      // Assign the word to the selected category (or leave uncategorized)
      if (categoryId && categoryId !== "none") {
        await assignToCategory.mutateAsync({
          wordId: newWord.id,
          categoryId,
        });
      }

      toast.success("Word added to your collection!");
      router.push("/my-words");
    } catch (error) {
      console.error("Error adding word:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add word";
      toast.error(errorMessage);
    }
  };

  const addExampleField = () => {
    setExampleSentences([...exampleSentences, ""]);
  };

  const removeExampleField = (index: number) => {
    setExampleSentences(exampleSentences.filter((_, i) => i !== index));
  };

  const updateExample = (index: number, value: string) => {
    const updated = [...exampleSentences];
    updated[index] = value;
    setExampleSentences(updated);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/my-words")}
            className="mb-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Words
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/10 flex items-center justify-center shadow-[0_4px_14px_rgba(249,115,22,0.4)]">
              <Sparkles className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Add New Word
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Expand your vocabulary by adding new words with examples
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-0">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <CardTitle>Word Details</CardTitle>
            <CardDescription>
              Fill in the information about your new word. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Word Input */}
              <div className="space-y-3">
                <Label htmlFor="word" className="text-base font-semibold flex items-center gap-2">
                  English Word
                  <Badge variant="destructive" className="rounded-full text-xs">Required</Badge>
                </Label>
                <Input
                  id="word"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="e.g., excellent"
                  required
                  className="rounded-2xl h-14 text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter the English word you want to learn
                </p>
              </div>

              {/* Category Selection */}
              <div className="space-y-3">
                <Label htmlFor="category" className="text-base font-semibold">
                  Category
                </Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="w-full rounded-2xl h-14 border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500">
                    <SelectValue placeholder="Select a category (optional)" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="none">
                      <span className="flex items-center gap-2">
                        <span className="text-gray-500">📂</span>
                        <span>Uncategorized</span>
                      </span>
                    </SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Organize your words by selecting a category
                </p>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-semibold flex items-center gap-2">
                  Description
                  <Badge variant="destructive" className="rounded-full text-xs">Required</Badge>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., An adjective meaning very good or of high quality. Used to describe something that is exceptional or outstanding."
                  rows={4}
                  required
                  className="rounded-2xl text-base border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300 resize-none"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Provide a clear definition and explanation of the word
                </p>
              </div>

              {/* Example Sentences */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    Example Sentences
                    <Badge variant="destructive" className="rounded-full text-xs">At least 1 required</Badge>
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addExampleField}
                    className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all duration-300"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Example
                  </Button>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add example sentences to show how the word is used in context
                </p>

                <div className="space-y-4">
                  {exampleSentences.map((example, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-sm mt-2">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <Textarea
                            value={example}
                            onChange={(e) => updateExample(index, e.target.value)}
                            placeholder={`Example ${index + 1}: "She did an excellent job on the project, exceeding all expectations."`}
                            rows={3}
                            required={index === 0}
                            className="rounded-2xl text-base border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all duration-300 resize-none"
                          />
                        </div>
                        {exampleSentences.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExampleField(index)}
                            className="shrink-0 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 h-10 w-10 mt-2"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/my-words")}
                  className="flex-1 rounded-2xl h-14 text-base border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-2xl h-14 text-base bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] transition-all duration-300"
                  disabled={addWord.isPending}
                >
                  {addWord.isPending ? (
                    <>
                      <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Add Word
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="mt-6 rounded-3xl border-2 border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-lg">💡</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  Tips for Better Learning
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                  <li>• Write detailed descriptions to help you remember the meaning</li>
                  <li>• Include multiple example sentences showing different contexts</li>
                  <li>• Use categories to organize related words together</li>
                  <li>• Add words you encounter while reading or listening for better retention</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
