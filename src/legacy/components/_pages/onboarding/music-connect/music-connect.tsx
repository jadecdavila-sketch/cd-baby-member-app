'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Button } from '@/components/button';
import { Label } from '@/components/label';
import { Music } from 'lucide-react';
import { Textarea } from '@/components/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/form';
import {
  CustomerRole,
  getAvailableCustomerRoles,
  saveCustomerRoles,
} from '@/legacy/services/customerService';
import { subLookup } from '@/legacy/services/userService';

const formSchema = z
  .object({
    musicConnection: z.string().min(1, 'Please select a valid role.'),
    otherDescription: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.musicConnection === '6') {
        return (
          !!data.otherDescription && data.otherDescription.trim().length >= 2
        );
      }
      return true;
    },
    {
      message: 'Please describe your connection to music.',
      path: ['otherDescription'],
    }
  );

const roleDescriptions: Record<string, string> = {
  Artist: 'Singer, songwriter, composer, musician',
  Label: 'Record label, music publisher',
  DJ: 'Someone who performs or mixes music',
  Producer: 'Audio engineer, music producer',
  JustForFun: "I enjoy making music but it's just a hobby",
  Other: 'Tell us how you connect with music',
};

const MusicConnectPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [roles, setRoles] = useState<CustomerRole[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      musicConnection: '',
      otherDescription: '',
    },
  });

  const selectedConnection = form.watch('musicConnection');

  // Reset "other" textarea when a different connection is selected
  useEffect(() => {
    if (selectedConnection !== '6') {
      form.setValue('otherDescription', '');
    }
  }, [selectedConnection, form]);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!session) return;
      try {
        const data = await getAvailableCustomerRoles(session);
        setRoles(data as CustomerRole[]);

        const userId = 1; // Replace with actual logic to get user ID
        console.log('User ID from subLookup:', userId);
        if (!userId) return;
        setUserId(userId);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, [session]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const roleId = Number(values.musicConnection);
    // if (userId === null) {
    // console.error("User ID is null — cannot save role.");
    // return;
    // }
    const body = {
      UserId: userId,
      RoleIds: [roleId],
      Description: roleId === 6 ? (values.otherDescription ?? '') : '',
    };
    //TODO Update after new AUth
    //await saveCustomerRoles(session!, body);
    router.push('/onboarding/name');
  };

  return (
    <div className="flex w-full justify-center">
      <Card className="w-full justify-center border-none shadow-lg lg:w-1/2">
        <CardHeader>
          <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <Music className="text-primary h-6 w-6" />
          </div>
          <CardTitle className="text-center text-xl">
            How do you connect with music?
          </CardTitle>
          <CardDescription className="text-center">
            Tell us about your relationship with the music world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="musicConnection"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="space-y-3"
                      >
                        {roles.map(({ roleIdValue, roleName, roleCode }) => (
                          <Label
                            key={roleIdValue}
                            className="hover:bg-muted/50 flex cursor-pointer items-start space-x-2 rounded-md border p-3"
                            htmlFor={`role-${roleIdValue}`}
                          >
                            <RadioGroupItem
                              value={roleIdValue.toString()}
                              id={`role-${roleIdValue}`}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <span className="text-base font-medium">
                                {roleName}
                              </span>
                              <p className="text-muted-foreground mb-2 text-sm">
                                {roleDescriptions[roleCode] ?? ''}
                              </p>
                              {roleIdValue === 6 &&
                                Number(selectedConnection) === 6 && (
                                  <FormField
                                    control={form.control}
                                    name="otherDescription"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Textarea
                                            {...field}
                                            placeholder="Please describe your connection to music..."
                                            className="mt-2"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                )}
                            </div>
                          </Label>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                id="continue-button"
                type="submit"
                className="mt-4 w-full"
              >
                Continue
              </Button>
              <Button
                type="button"
                variant="outline"
                className="mt-2 w-full"
                onClick={() => router.push('/onboarding/name')}
              >
                Skip for now
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicConnectPage;
