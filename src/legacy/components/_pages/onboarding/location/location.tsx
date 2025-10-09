'use client';

import { CountryStateSelect } from '@/components/_shared/country-dropdown';
import { Button } from '@/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/form';
import { Input } from '@/components/input';
import {
  saveContributor,
  saveCustomerLocation,
} from '@/legacy/services/customerService';
import { subLookup } from '@/legacy/services/userService';
import { zodResolver } from '@hookform/resolvers/zod';
import { set } from 'date-fns';
import { Globe } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from '@/legacy/services/authService';
import * as z from 'zod';

const locationSchema = z.object({
  country: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
});

const LocationPage = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => signIn(),
  });

  const locationForm = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      country: '',
      state: '',
      postalCode: '',
    },
  });

  useEffect(() => {
    const fetchRoles = async () => {
      if (!session) return;
      try {
        const fetchId = 1; // Replace with actual logic to get user ID
        if (!fetchId) return;
        setUserId(fetchId);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, [session]);

  const onSubmit = async (values: z.infer<typeof locationSchema>) => {
    try {
      if (userId === null) {
        throw new Error('User ID is not available.');
      }
      const locationData = {
        userId, // userId is guaranteed to be a number here
        city: values.state || '',
        country: values.country || '',
        postalCode: values.postalCode || '',
        modifiedBy: 0,
        street1: '',
        street2: '', // Optional, can be added if needed
        region: '', // Optional, can be added if needed
      };
      console.log('Location Data:', locationData);
      //await saveCustomerLocation(session!, locationData);

      //TODO keeping some info harcoded for now, till we can get all the actual data
      const contributorData = {
        userId,
        contributorName: 'John Smith', // Not sure if contributor is same as the one collected on the name page
        performingRightsOrganization: 'ASCAP',
        ipi: 'I-123456789',
        isni: '0000 0001 2345 6789',
        artistName: 'The Rolling Stones',
        isBand: true,
        region: 'London',
        country: values.country || '',
        postalCode: values.postalCode || '',
      };
      //Saving contributor data after location
      //await saveContributor(session!, contributorData);

      router.push('/onboarding/about-yourself');
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  return (
    <div className="flex justify-center text-center">
      <Card className="w-full border-none shadow-lg lg:w-1/2">
        <CardHeader>
          <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <Globe className="text-primary h-6 w-6" />
          </div>
          <CardTitle className="text-center text-xl">
            Where are you based?
          </CardTitle>
          <CardDescription className="text-center">
            Tell us your location to help connect you with local opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...locationForm}>
            <form
              onSubmit={locationForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <CountryStateSelect
                    countryFieldName="country"
                    stateFieldName="state"
                  />
                </div>

                <FormField
                  control={locationForm.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input
                          id="postalcodeinput"
                          placeholder="Postal Code"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-6 flex justify-between">
                  <Button
                    id="back-button"
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Back
                  </Button>
                  <Button id="continue-button" type="submit">
                    Continue
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationPage;
