"use client";

import { useEffect } from "react";
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
import { Plus, X, FileQuestion } from "lucide-react";
import { useUpdateGrammarTopic } from "../hooks/useGrammarTopics";
import { useActiveGrammarCategories } from "../hooks/useGrammarCategories";
import { Level } from "@/shared/types/common.types";
import { GrammarRule } from "@/features/grammar/types/service.types";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import type { FieldArrayPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { createGrammarTopicSchema, type CreateGrammarTopicFormData } from "../types/validation";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

interface EditGrammarDialogProps {
  open: boolean;
  onClose: () => void;
  topic: GrammarRule | null;
}

export function EditGrammarDialog({ open, onClose, topic }: EditGrammarDialogProps) {
  const updateTopic = useUpdateGrammarTopic();
  const { data: categories, isLoading: categoriesLoading } = useActiveGrammarCategories();
  const router = useRouter();

  const form = useForm<CreateGrammarTopicFormData>({
    resolver: zodResolver(createGrammarTopicSchema),
    defaultValues: {
      title: "",
      category_id: "",
      difficulty_level: "B1",
      explanation: "",
      mini_text: "",
      examples: [""],
      order_index: 1,
      is_premium: false,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  type ExamplesArrayName = FieldArrayPath<CreateGrammarTopicFormData>;
  const { fields, append, remove } = useFieldArray<CreateGrammarTopicFormData>({ control: form.control, name: "examples" as ExamplesArrayName });

  useEffect(() => {
    if (topic) {
      form.reset({
        title: topic.title,
        category_id: topic.category_id,
        difficulty_level: topic.difficulty_level as Level,
        explanation: topic.explanation,
        mini_text: topic.mini_text,
        examples: topic.examples.length > 0 ? topic.examples : [""],
        order_index: topic.order_index,
        is_premium: topic.is_premium,
      });
    }
  }, [topic, form]);

  const onSubmitForm = async (data: CreateGrammarTopicFormData) => {
    if (!topic) return;

    await updateTopic.mutateAsync({
      id: topic.id,
      data: {
        title: data.title,
        category_id: data.category_id,
        difficulty_level: data.difficulty_level as Level,
        explanation: data.explanation,
        mini_text: data.mini_text,
        examples: (data.examples || []).filter((ex) => ex.trim()),
        order_index: data.order_index,
        is_premium: data.is_premium,
        updated_at: new Date().toISOString(),
      },
    });

    onClose();
  };

  const handleManageQuestions = () => {
    if (!topic) return;
    onClose();
    router.push(`/admin/grammar/${topic.id}/questions`);
  };

  if (!topic) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Grammar Topic</DialogTitle>
          <DialogDescription>
            Update the grammar lesson details
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Present Perfect vs Past Simple" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange} required disabled={categoriesLoading}>
                          <SelectTrigger>
                            <SelectValue placeholder={categoriesLoading ? "Loading..." : "Select category"} />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                <span className="flex items-center gap-2">
                                  <span>{cat.icon}</span>
                                  <span>{cat.name}</span>
                                </span>
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
                <FormField
                  control={form.control}
                  name="difficulty_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level *</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={(val) => field.onChange(val as Level)} required>
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="order_index"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Index</FormLabel>
                      <FormControl>
                        <Input type="number" value={Number(field.value ?? 1)} min={1} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="is_premium"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <input type="checkbox" id="isPremium" checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
                    </FormControl>
                    <Label htmlFor="isPremium">Premium Content</Label>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="explanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Explanation *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Explain the grammar concept..." rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Examples *</Label>
              {fields.map((fieldItem, index) => (
                <div key={fieldItem.id} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`examples.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder={`Example ${index + 1}`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => append("")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Example
              </Button>
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="mini_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Practice Text *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A short text demonstrating the grammar concept..." rows={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="button" variant="secondary" onClick={handleManageQuestions} className="flex-1">
                <FileQuestion className="mr-2 h-4 w-4" />
                Manage Questions
              </Button>
              <Button type="submit" className="flex-1" disabled={updateTopic.isPending}>
                {updateTopic.isPending ? "Updating..." : "Update Topic"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
