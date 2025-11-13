'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageHeader, ContentCard, DeleteConfirmDialog } from '@/features/admin/shared/components';
import { AddQuestionDialog, EditQuestionDialog } from '../components';
import { useGrammarQuestions } from '../hooks';

interface GrammarQuestionsPageClientProps {
  topicId: string;
}

export function GrammarQuestionsPageClient({ topicId }: GrammarQuestionsPageClientProps) {
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
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/grammar')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Grammar Topics
          </Button>

          <PageHeader
            icon={<span className="text-4xl">❓</span>}
            iconBgClass="bg-linear-to-br from-blue-400 to-blue-600 shadow-[0_4px_14px_rgba(59,130,246,0.4)]"
            title={topic?.title || 'Grammar Questions'}
            description="Manage quiz questions for this grammar topic"
            action={
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            }
          />
        </div>

        <ContentCard
          title="Quiz Questions"
          description={`Total: ${questions.length} questions`}
        >
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
        </ContentCard>
      </div>

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
