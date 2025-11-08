"use client";

import React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { DeleteConfirmDialog } from "@/features/admin/components/DeleteConfirmDialog";
import { useGrammarQuestions } from "@/features/admin/hooks/useGrammarQuestions";
import { AddQuestionDialog } from "@/features/admin/components/AddQuestionDialog";
import { EditQuestionDialog } from "@/features/admin/components/EditQuestionDialog";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GrammarQuestionsPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const topicId = resolvedParams.id;
  const router = useRouter();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  
  const { data: questionsData, isLoading } = useGrammarQuestions(topicId);
  const questions = questionsData?.questions || [];
  const topic = questionsData?.topic;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/grammar")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Grammar Topics
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {topic?.title || "Grammar Questions"}
            </h1>
            <p className="text-muted-foreground">
              Manage quiz questions for this grammar topic
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Questions</CardTitle>
          <CardDescription>
            Total: {questions.length} questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No questions yet. Add your first question to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Correct Answer</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question: any, index: number) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="max-w-md">{question.question}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{question.correct_answer}</Badge>
                    </TableCell>
                    <TableCell>{question.options?.length || 0} options</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedQuestion(question);
                          setShowEditDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedQuestion(question);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddQuestionDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        topicId={topicId}
      />

      <EditQuestionDialog
        open={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setSelectedQuestion(null);
        }}
        question={selectedQuestion}
        topicId={topicId}
      />

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedQuestion(null);
        }}
        onConfirm={async () => {
          // Delete logic will be handled by hook
          setShowDeleteDialog(false);
          setSelectedQuestion(null);
        }}
        title="Delete Question"
        description="Are you sure you want to delete this question? This action cannot be undone."
        isPending={false}
      />
    </div>
  );
}
