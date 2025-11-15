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
import { Plus, X } from "lucide-react";
import { useGrammarQuestions } from "../hooks";
import { useForm, useFieldArray } from "react-hook-form";
import type { FieldArrayPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { grammarQuestionSchema, type GrammarQuestionFormData } from "../types/validation";

interface AddQuestionDialogProps {
  open: boolean;
  onClose: () => void;
  topicId: string;
}

export function AddQuestionDialog({
  open,
  onClose,
  topicId,
}: AddQuestionDialogProps) {
  const { data: questionsData } = useGrammarQuestions(topicId);

  const form = useForm<GrammarQuestionFormData>({
    resolver: zodResolver(grammarQuestionSchema),
    defaultValues: {
      question: "",
      options: ["", "", "", ""],
      correct_answer: "",
      explanation: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  type OptionsArrayName = FieldArrayPath<GrammarQuestionFormData>;
  const { fields, append, remove } = useFieldArray<GrammarQuestionFormData>({ control: form.control, name: "options" as OptionsArrayName });

  useEffect(() => {
    if (!open) {
      form.reset({ question: "", options: ["", "", "", ""], correct_answer: "", explanation: "" });
    }
  }, [open, form]);

  const onSubmitForm = async (data: GrammarQuestionFormData) => {
    if (!questionsData?.topic?.content_id) {
      onClose();
      return;
    }

    form.reset({ question: "", options: ["", "", "", ""], correct_answer: "", explanation: "" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Quiz Question</DialogTitle>
          <DialogDescription>
            Create a new question for this grammar topic
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6" noValidate>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter the question text..." rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Answer Options *</Label>
              {fields.map((fieldItem, index) => (
                <div key={fieldItem.id} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`options.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder={`Option ${index + 1}`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 2 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => append("")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="correct_answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correct Answer *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the exact correct answer from options above" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-xs text-muted-foreground">Must match one of the options exactly</p>
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="explanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Explanation *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Explain why this is the correct answer..." rows={4} {...field} />
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
              <Button type="submit" className="flex-1">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
