import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { exampleFormSchema, type ExampleFormData } from '@/shared/schemas';

interface UseExampleFormOptions {
  onSuccess?: ((data: ExampleFormData) => void) | undefined;
  onError?: ((error: Error) => void) | undefined;
}

export function useExampleForm(options: UseExampleFormOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const form = useForm<ExampleFormData>({
    resolver: zodResolver(exampleFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      country: '',
      newsletter: false,
      preferences: '',
      message: '',
    } as ExampleFormData,
    mode: 'onChange',
  });

  const { watch, handleSubmit, reset } = form;
  const newsletter = watch('newsletter');

  const onSubmit = async (data: ExampleFormData) => {
    setIsSubmitting(true);
    setSubmitCount((prev) => prev + 1);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Clean up conditional fields
      const cleanData = {
        ...data,
        preferences: data.newsletter ? data.preferences : undefined,
      };

      console.log('Form submitted:', cleanData);
      toast.success('Form submitted successfully!');

      options.onSuccess?.(cleanData);

      // Reset form after successful submission
      reset();
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Submission failed');
      console.error('Form submission error:', err);
      toast.error('Failed to submit form. Please try again.');
      options.onError?.(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset();
    setSubmitCount(0);
  };

  return {
    form,
    onSubmit: handleSubmit(onSubmit),
    isSubmitting,
    submitCount,
    resetForm,
    newsletter,
  };
}

export type UseExampleFormReturn = ReturnType<typeof useExampleForm>;
