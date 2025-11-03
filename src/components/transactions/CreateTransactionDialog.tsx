import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/lib/api';

const transactionSchema = z.object({
  type: z.enum(['CREDIT', 'DEBIT']),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface CreateTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateTransactionDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateTransactionDialogProps) {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'DEBIT',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: TransactionFormData) => {
    setIsLoading(true);
    setError('');

    // Validate required fields
    if (!data.date) {
      setError('Date is required');
      setIsLoading(false);
      return;
    }

    if (!data.category || !data.category.trim()) {
      setError('Category is required');
      setIsLoading(false);
      return;
    }

    if (!data.amount || data.amount <= 0) {
      setError('Amount must be greater than 0');
      setIsLoading(false);
      return;
    }

    // Build payload, excluding undefined values
    const payload: { type: 'CREDIT' | 'DEBIT'; amount: number; category: string; description?: string; date: string } = {
      type: data.type as 'CREDIT' | 'DEBIT',
      amount: data.amount,
      category: data.category.trim(),
      date: data.date, // YYYY-MM-DD format - backend uses z.coerce.date() to convert to Date
    };

    // Only include description if it's not empty
    if (data.description && data.description.trim()) {
      payload.description = data.description.trim();
    }

    console.log('Creating transaction with payload:', payload);

    try {
      await api.transactions.create(payload);
      reset();
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      const axiosErr = err as { response?: { data?: unknown; status?: number } };
      const errorData = axiosErr?.response?.data as { error?: string; message?: string; details?: unknown[]; errors?: Record<string, string | string[]> } | undefined;
      
      console.error('Transaction creation error:', {
        status: axiosErr?.response?.status,
        data: errorData,
        details: errorData?.details,
      });
      
      // Log full details for debugging
      if (errorData?.details && Array.isArray(errorData.details)) {
        console.error('Validation details:', JSON.stringify(errorData.details, null, 2));
      }
      
      const message = errorData?.error || errorData?.message;
      let errorMessage = '';
      
      // Handle validation errors in details array
      if (errorData?.details && Array.isArray(errorData.details) && errorData.details.length > 0) {
        const detailsMessages = errorData.details.map((d: unknown) => {
          if (typeof d === 'string') {
            return d;
          } else if (typeof d === 'object' && d !== null) {
            const detail = d as { 
              field?: string; 
              path?: string[] | string | number; 
              message?: string; 
              msg?: string;
              code?: string;
              expected?: string;
              received?: string;
            };
            
            // Handle Zod error structure
            const path = Array.isArray(detail.path) 
              ? detail.path.filter(p => p !== undefined && p !== null).join('.')
              : (detail.path !== undefined && detail.path !== null ? String(detail.path) : '');
            
            const fieldName = detail.field || path || 'Unknown field';
            
            // Construct a user-friendly error message
            if (detail.message) {
              return `${fieldName}: ${detail.message}`;
            } else if (detail.msg) {
              return `${fieldName}: ${detail.msg}`;
            } else if (detail.code === 'invalid_type' && detail.expected && detail.received) {
              return `${fieldName}: Expected ${detail.expected}, but received ${detail.received}`;
            } else {
              return `${fieldName}: Validation failed`;
            }
          }
          return JSON.stringify(d);
        });
        errorMessage = detailsMessages.join(', ');
      } 
      // Handle validation errors in errors object
      else if (errorData?.errors) {
        if (typeof errorData.errors === 'object' && !Array.isArray(errorData.errors)) {
          const errors = Object.entries(errorData.errors)
            .map(([field, messages]) => {
              const msg = Array.isArray(messages) ? messages.join(', ') : String(messages);
              return `${field}: ${msg}`;
            })
            .join('; ');
          errorMessage = errors;
        } else {
          errorMessage = String(errorData.errors);
        }
      }
      // Fallback to message or full error data
      else {
        errorMessage = message || JSON.stringify(errorData) || 'Failed to create transaction';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              {...register('type')}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="CREDIT">Credit (Income)</option>
              <option value="DEBIT">Debit (Expense)</option>
            </select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...register('category')} />
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register('description')} />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" {...register('date')} />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

