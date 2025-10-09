'use client';
import { useSession } from 'next-auth/react';
import { FileText, User } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/form';
import { signIn } from '@/legacy/services/authService';
import {
  getCustomerName,
  saveCustomerName,
} from '@/legacy/services/customerService';
import { subLookup } from '@/legacy/services/userService';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
});

const NameInputPage = () => {
  const [userId, setUserId] = useState<number | null>(null);

  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => signIn(),
  });

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
    },
  });

  useEffect(() => {
    const fetchName = async () => {
      if (!session) return;
      //TODO
      try {
        const userId = 1; // Replace with actual logic to get user ID;
        if (!userId) return;
        setUserId(userId);

        if (session && session.user?.name) {
          const nameParts = session.user.name.split(' ');

          // Split name into first and last name if available
          form.setValue('firstName', nameParts[0]);
          form.setValue('lastName', nameParts[nameParts.length - 1]);

          // If there are more than 2 parts, the middle ones are middle name
          if (nameParts.length > 2) {
            form.setValue('middleName', nameParts.slice(1, -1).join(' '));
          }
        }
      } catch (error) {
        console.error('Failed to fetch user ID or name:', error);
      }
    };

    fetchName();
  }, [session, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!userId) {
        console.error('No userId available to submit form.');
        return;
      }
      const payload = {
        userId,
        firstName: values.firstName,
        middleName: values.middleName || '',
        lastName: values.lastName,
      };
      //await saveCustomerName(session!, payload);
      router.push('/onboarding/streaming');
    } catch (error) {
      console.error('Error saving name', error);
    }
  };

  return (
    <div className="flex w-full justify-center">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <User className="text-primary h-6 w-6" />
          </div>
          <CardTitle className="text-center text-xl">
            What's your name?
          </CardTitle>
          <CardDescription className="text-center">
            The name you'd use for official music business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                {/* ID Verification Banner */}
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                  <div className="flex items-start">
                    <div className="mt-0.5 mr-3">
                      <div className="rounded-full bg-blue-100 p-1">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-blue-800">
                        Faster signup with ID verification
                      </h3>
                      <p className="mt-1 text-xs text-blue-600">
                        Verify your identity to speed up your account approval
                        and unlock additional features.
                      </p>
                      <Button
                        id="verifyid-button"
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2 bg-white text-blue-600 hover:bg-blue-100 dark:bg-white dark:text-blue-600 dark:hover:bg-blue-100"
                      >
                        Verify with ID
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name-fields" className="text-base">
                    Full Name <span className="text-red-500">*</span>
                  </Label>

                  {/* Name fields with adjusted proportions */}
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-12">
                    <div className="col-span-1 md:col-span-5">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                id="first-name"
                                placeholder="First name"
                                className="h-10"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-3">
                      <FormField
                        control={form.control}
                        name="middleName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                id="middle-name"
                                placeholder="Middle (opt)"
                                className="h-10"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-4">
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                id="last-name"
                                placeholder="Last name"
                                className="h-10"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm">
                  This should match the name you'd use with performing rights
                  organizations, tax filings, or copyright registrations (if
                  applicable).
                </p>

                <Button id="continue-button" type="submit" className="w-full">
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NameInputPage;
