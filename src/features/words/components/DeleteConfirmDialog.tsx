'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteWord, type UserWord } from "../hooks/useWords";

interface DeleteConfirmDialogProps {
  word: UserWord | null;
  open: boolean;
  onClose: () => void;
}

/**
 * DeleteConfirmDialog Component
 * 
 * Confirmation dialog for word deletion:
 * - Shows word to be deleted
 * - Warning message
 * - Cancel/Delete buttons
 * 
 * @component
 */
export function DeleteConfirmDialog({
  word,
  open,
  onClose,
}: DeleteConfirmDialogProps) {
  const deleteWordMutation = useDeleteWord();

  const handleDelete = async () => {
    if (!word) return;

    try {
      await deleteWordMutation.mutateAsync(word.id);
      onClose();
    } catch (error) {
      console.error("Error deleting word:", error);
    }
  };

  if (!word) return null;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold">
            Delete Word
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Are you sure you want to delete "
            <span className="font-semibold text-gray-900 dark:text-white">
              {word.word}
            </span>
            "? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 sm:gap-3">
          <AlertDialogCancel
            onClick={onClose}
            className="rounded-2xl h-12 text-base border-2"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteWordMutation.isPending}
            className="rounded-2xl h-12 text-base bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-[0_4px_14px_rgba(239,68,68,0.4)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.5)] transition-all duration-300"
          >
            {deleteWordMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
