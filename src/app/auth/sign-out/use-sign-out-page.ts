import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';

export interface SignOutFormData {
  confirmSignOut: boolean;
  reason: string;
  feedback: string;
}

export function useSignOutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  const form = useForm<SignOutFormData>({
    defaultValues: {
      confirmSignOut: false,
      reason: '',
      feedback: '',
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const confirmSignOut = watch('confirmSignOut');

  const onSubmit = async (data: SignOutFormData) => {
    // For Sprint 0: This form demonstrates RHF usage
    console.log('Sign-out form submitted:', data);

    if (data.confirmSignOut) {
      alert(
        `Sign-out confirmed. Reason: ${data.reason || 'None'}, Feedback: ${data.feedback || 'None'}`
      );
    } else {
      alert('Please confirm you want to sign out.');
    }
  };

  const handleFusionAuthSignOut = () => {
    // This will use NextAuth's built-in sign-out flow
    signOut({ callbackUrl });
  };

  const handleCancel = () => {
    router.back();
  };

  return {
    // Form state and handlers
    register,
    handleSubmit,
    errors,
    isSubmitting,
    confirmSignOut,

    // Event handlers
    onSubmit,
    handleFusionAuthSignOut,
    handleCancel,

    // Data
    callbackUrl,
  };
}
