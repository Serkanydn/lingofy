/**
 * Create Subscription Form - Admin Premium
 * Following: docs/03-code-standards/02-component-architecture.md
 */

'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { createSubscriptionSchema, type CreateSubscriptionFormData } from '../types/validation';

interface CreateSubscriptionFormProps {
  isOpen: boolean;
  onToggle: () => void;
  onSubmit: (data: {
    email: string;
    full_name: string;
    is_premium: boolean;
    premium_expires_at: string | null;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function CreateSubscriptionForm({
  isOpen,
  onToggle,
  onSubmit,
  isLoading,
}: CreateSubscriptionFormProps) {
  const form = useForm<CreateSubscriptionFormData>({
    resolver: zodResolver(createSubscriptionSchema),
    defaultValues: {
      email: '',
      full_name: '',
      is_premium: false,
      premium_expires_at: null,
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const handleReset = () => {
    form.reset({ email: '', full_name: '', is_premium: false, premium_expires_at: null });
    onToggle();
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
            <span className="text-2xl">➕</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Add New Subscription
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isOpen ? 'Click to collapse' : 'Click to expand and create a new user with subscription'}
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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (data) => {
                await onSubmit({
                  email: data.email,
                  full_name: data.full_name,
                  is_premium: data.is_premium,
                  premium_expires_at:
                    data.is_premium && data.premium_expires_at
                      ? new Date(data.premium_expires_at).toISOString()
                      : null,
                });
                handleReset();
              })}
              className="space-y-6 mt-6"
              noValidate
            >
            {/* Email and Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="user@example.com" className="rounded-2xl border-2 h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 dark:text-gray-400">A temporary password will be sent to this email</p>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="John Doe" className="rounded-2xl border-2 h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Premium Status Toggle */}
              <FormField
                control={form.control}
                name="is_premium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Grant Premium Access</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-900/10 border-2 border-orange-100 dark:border-orange-900/30">
                        <div className="space-y-0.5">
                          <Label htmlFor="premium-status" className="text-sm font-semibold">Grant Premium Access</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Enable premium features for this user</p>
                        </div>
                        <Switch id="premium-status" checked={field.value} onCheckedChange={field.onChange} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            {/* Expiration Date */}
            {form.watch('is_premium') && (
              <FormField
                control={form.control}
                name="premium_expires_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Expiration Date</FormLabel>
                    <FormControl>
                      <Input type="date" min={new Date().toISOString().split('T')[0]} className="rounded-2xl border-2 h-12" value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Leave empty for unlimited access</p>
                  </FormItem>
                )}
              />
            )}

            {/* Info Alert */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-1">Important Notes:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>User will receive an email to set their password</li>
                  <li>Premium access can be managed later</li>
                  <li>Default role will be set to 'user'</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button type="button" variant="outline" onClick={handleReset} className="flex-1 rounded-2xl border-2 h-12" disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 rounded-2xl h-12 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-[0_4px_14px_rgba(34,197,94,0.4)]" disabled={isLoading || form.formState.isSubmitting}>
                {isLoading || form.formState.isSubmitting ? 'Creating...' : 'Create User & Subscription'}
              </Button>
            </div>
            </form>
          </Form>
        </CardContent>
      )}
    </Card>
  );
}
