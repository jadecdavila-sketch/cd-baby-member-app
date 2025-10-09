'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/card';
import { Check, FileText } from 'lucide-react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/form';
import { Checkbox } from '@/components/checkbox';
import {
  getCustomerAgreement,
  saveCustomerAgreement,
} from '@/legacy/services/customerService';
import { useRouter } from 'next/navigation';
import { signIn } from '@/legacy/services/authService';
const formSchema = z.object({
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  signature: z.string().min(1, 'Signature is required'),
});

const TosPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => signIn(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      signature: '',
      terms: false,
    },
  });

  useEffect(() => {
    const fetchName = async () => {
      if (!session) return;
      try {
        if (session && session.user?.name) {
          form.setValue('signature', session.user?.name);
        }
        await getCustomerAgreement(session);
      } catch (error) {
        console.error('Failed to fetch', error);
      }
    };

    fetchName();
  }, [session, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      //TODO Adjust payload as business logic comes together
      const payload = {
        userId: 1, // make sure this exists or adapt it
        signatureEntry: values.signature,
        contractTypeId: 2, // hardcoded for now
        dateSigned: new Date().toISOString(),
        modifiedBy: 100,
      };
      //   await saveCustomerAgreement(session!, payload);
      router.push('/onboarding/profile-complete');
    } catch (error) {
      console.error('Error saving terms', error);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-none">
        <CardHeader>
          <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <FileText className="text-primary h-6 w-6" />
          </div>
          <CardTitle className="text-center text-xl">
            Terms of Service
          </CardTitle>
          <CardDescription className="text-center">
            Please read and accept the terms to proceed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div className="max-h-64 overflow-auto rounded-lg border p-4">
                  {/* Terms of Service Content */}
                  <p className="text-muted-foreground text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    euismod, diam id tincidunt condimentum, libero dolor aliquet
                    augue, vel tincidunt dolor libero vel augue. Sed euismod,
                    diam id tincidunt condimentum, libero dolor aliquet augue,
                    vel tincidunt dolor libero vel augue. Sed euismod, diam id
                    tincidunt condimentum, libero dolor aliquet augue, vel
                    tincidunt dolor libero vel augue. Sed euismod, diam id
                    tincidunt condimentum, libero dolor aliquet augue, vel
                    tincidunt dolor libero vel augue. Sed euismod, diam id
                    tincidunt condimentum, libero dolor aliquet augue, vel
                    tincidunt dolor libero vel augue. Sed euismod, diam id
                    tincidunt condimentum, libero dolor aliquet augue, vel
                    tincidunt dolor libero vel augue. Sed euismod, diam id
                    tincidunt condimentum, libero dolor aliquet augue, vel
                    tincidunt dolor libero vel augue. Sed euismod, diam id
                    tincidunt condimentum, libero dolor aliquet augue, vel
                    tincidunt dolor libero vel augue.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="block">
                        <FormControl>
                          <Checkbox
                            id="terms-checkbox"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor="terms"
                          className="ml-2 inline-block"
                        >
                          I accept the terms and conditions
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Signature Field */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="signature"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="signature"
                            placeholder="Signature"
                            className="h-10"
                            disabled
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="text-muted-foreground text-sm">
                    By signing, you agree to the terms of service.
                  </p>
                </div>
                <Button
                  id="acceptterms-button"
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      Saving...
                      <svg
                        className="ml-2 h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </>
                  ) : (
                    'Accept Terms and Complete Profile'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
export default TosPage;
