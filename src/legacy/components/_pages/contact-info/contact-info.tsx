'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  subLookup,
  saveContactInfo,
  ContactInfo,
} from '@/legacy/services/userService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/form';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';
import { CountryStateSelect } from '@/components/_shared/country-dropdown';
import { signIn } from '@/legacy/services/authService';

export const formSchema = z.object({
  // Personal details
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  middleName: z.string().optional(),

  // Address details
  street1: z.string().min(3, 'Street address must be at least 3 characters'),
  street2: z.string().optional(),
  city: z.string().optional(),
  region: z
    .string({ required_error: 'Region is required' })
    .min(1, 'Region is required'),
  country: z
    .string({ required_error: 'Country is required' })
    .min(1, 'Country is required'),
  postalCode: z
    .string()
    .min(4, 'Postal code must be at least 4 characters')
    .max(10, 'Postal code must be less than 10 characters'),

  //Company information
  companyName: z.string().optional(),

  // Phone information
  phoneNumber: z.string().regex(/^\+?\d{7,15}$/, 'Phone number must be valid'),
  dialPrefix: z.string().optional(),
  phoneTypeId: z.number({
    required_error: 'Phone type is required',
  }),
});

const phoneTypes = [
  { id: 1, name: 'Mobile' },
  { id: 2, name: 'Home' },
  { id: 3, name: 'Work' },
  { id: 4, name: 'Other' },
];

type ContactInfoFormProps = {
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void | Promise<void>;
  ContactInfoCountryStateSelectField: React.ReactNode;
};

export const ContactInfoForm = ({
  form,
  onSubmit,
  ContactInfoCountryStateSelectField,
}: ContactInfoFormProps) => {
  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-[400px] text-center">
        <CardHeader>
          <CardTitle>Contact Info</CardTitle>
          <CardDescription>Fill in your contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        id="firstnameinput"
                        placeholder="first name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        id="lastnameinput"
                        placeholder="last name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input
                        id="middlenameinput"
                        placeholder="middle name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        id="companynameinput"
                        placeholder="company name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="street1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street 1</FormLabel>
                    <FormControl>
                      <Input
                        id="street1input"
                        placeholder="street 1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="street2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street 2</FormLabel>
                    <FormControl>
                      <Input
                        id="street2input"
                        placeholder="street 2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input id="cityinput" placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {ContactInfoCountryStateSelectField}
              <FormField
                control={form.control}
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
              <FormField
                control={form.control}
                name="dialPrefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dial Prefix</FormLabel>
                    <FormControl>
                      <Input id="dialprefixinput" placeholder="+1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        id="phonenumberinput"
                        placeholder="Phone Number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Type</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? String(field.value) : ''}
                    >
                      <FormControl>
                        <SelectTrigger
                          id="phonetypeselect"
                          className="mb-4 w-full"
                        >
                          <SelectValue placeholder="Select a phone type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {phoneTypes.map((type) => (
                          <SelectItem key={type.id} value={String(type.id)}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button id="submitbutton" type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

const ContactInfoPage = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => signIn(),
  });

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      companyName: '',
      street1: '',
      street2: '',
      city: '',
      region: '',
      country: '',
      postalCode: '',
      phoneNumber: '',
      dialPrefix: '',
      phoneTypeId: undefined,
    },
  });

  useEffect(() => {
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
  }, [session, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form Values:', values);
    try {
      // Get userId using b2csubLookup
      const userId = await subLookup(session!);
      if (!userId) throw new Error('Could not find user ID.');

      const contactInfo: ContactInfo = {
        userId: userId,
        firstName: values.firstName,
        lastName: values.lastName,
        middleName: values.middleName || undefined,
        company: values.companyName || undefined,
        street1: values.street1,
        street2: values.street2 || undefined,
        city: values.city,
        region: values.region,
        country: values.country,
        postalCode: values.postalCode,
        phoneNumber: values.phoneNumber,
        dialPrefix: values.dialPrefix || undefined,
        phoneTypeId: values.phoneTypeId,
      };
      console.log('Contact Info:', contactInfo);
      // Use the service function to save contact info
      await saveContactInfo(session!, contactInfo);
      // Use router.push instead of redirect for client-side navigation
      router.push('/dashboard');
    } catch (err) {
      console.error('Error saving contact info:', err);
    }
  };

  return (
    <ContactInfoForm
      form={form}
      onSubmit={onSubmit}
      ContactInfoCountryStateSelectField={
        <CountryStateSelect
          countryFieldName="country"
          stateFieldName="region"
        />
      }
    />
  );
};

export default ContactInfoPage;
