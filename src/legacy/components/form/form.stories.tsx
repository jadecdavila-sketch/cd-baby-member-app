import { userEvent, within, waitFor, expect } from 'storybook/test';
import { zodResolver } from '@hookform/resolvers/zod';
import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Input } from '@/components/input';
import { Separator } from '@/components/separator';
import { Button } from '@/components/button';
import { useEffect } from 'react';

const meta: Meta<typeof Form> = {
  title: 'ui/Form',
  component: Form,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Regular form example */
const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

const ProfileForm = (args: Story['args']) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    action('Form Submitted')(values);
  }

  return (
    <Form {...args} {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          className="bg-primary text-primary-foreground rounded px-4 py-2"
          type="submit"
        >
          Submit
        </button>
      </form>
    </Form>
  );
};
/** Options Based On Other Field */
/*
field is provided by React Hook Form inside render.
 It includes value, onChange, onBlur, and ref.
Using field automates state management, in case to not use field, we need to manually manage the state of the input:
eg:

      const [selectedCategory, setSelectedCategory] = useState("");
      <Select onValueChange={(value) => setSelectedCategory(value)} value={selectedCategory}>

*/
const dependentSchema = z.object({
  category: z.string().min(1, 'You must select a category'),
  subcategory: z.string().min(1, 'You must select a subcategory'),
});

const selectOptions = {
  fruits: ['Apple', 'Banana', 'Orange'],
  vegetables: ['Carrot', 'Broccoli', 'Spinach'],
};

const DependentSelectForm = () => {
  const dependentForm = useForm<z.infer<typeof dependentSchema>>({
    resolver: zodResolver(dependentSchema),
    defaultValues: {
      category: '',
      subcategory: '',
    },
  });
  const category = dependentForm.watch(
    'category'
  ) as keyof typeof selectOptions;

  function onSubmit(values: z.infer<typeof dependentSchema>) {
    action('Form Submitted')(values);
  }

  return (
    <Form {...dependentForm}>
      <form onSubmit={dependentForm.handleSubmit(onSubmit)}>
        <FormField
          control={dependentForm.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    dependentForm.setValue('subcategory', '');
                    action('Category Selected')(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="mb-4 w-96">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={dependentForm.control}
          name="subcategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategory</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    action('Subcategory Selected')(value);
                  }}
                  value={field.value}
                  disabled={!category} // Disable if no category is selected
                >
                  <FormControl>
                    <SelectTrigger className="w-96">
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectOptions[category]?.map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-4">
          {' '}
          Submit{' '}
        </Button>
      </form>
    </Form>
  );
};

/** Conditional Input*/

const conditionalSchema = z
  .object({
    option: z.string().min(1, 'You must select an option'),
    extraInput: z.string().optional(),
  })
  .refine(
    (data) => {
      return (
        data.option !== 'other' ||
        (data.extraInput && data.extraInput.trim() !== '')
      );
    },
    {
      message: 'This field must be filled',
      path: ['extraInput'],
    }
  );

const ConditionalInputForm = () => {
  const conditionalForm = useForm<z.infer<typeof conditionalSchema>>({
    resolver: zodResolver(conditionalSchema),
    defaultValues: {
      option: '',
      extraInput: '',
    },
  });

  const selectedOption = conditionalForm.watch('option');

  function onSubmit(values: z.infer<typeof conditionalSchema>) {
    const finalValues = {
      option: values.option === 'other' ? values.extraInput : values.option,
    };
    action('Form Submitted')(finalValues);
  }

  return (
    <Form {...conditionalForm}>
      <form
        onSubmit={conditionalForm.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={conditionalForm.control}
          name="option"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select an Option</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-[1rem_1fr] items-center gap-2"
                >
                  <RadioGroupItem value="option1" id="option1" />
                  <label htmlFor="option1">Option 1</label>
                  <RadioGroupItem value="option2" id="option2" />
                  <label htmlFor="option2">Option 2</label>
                  <RadioGroupItem value="other" id="other" />
                  <label htmlFor="other">Other</label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Show extra input only for certain options */}
        {selectedOption === 'other' && (
          <FormField
            control={conditionalForm.control}
            name="extraInput"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Extra field</FormLabel>
                <FormControl>
                  <Input
                    className="mt-2"
                    placeholder="Enter details"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="mt-4">
          {' '}
          Submit{' '}
        </Button>
      </form>
    </Form>
  );
};

/**Info Between Two Forms */
const secondFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    address: z.string().optional(),
    phone: z.string().optional(),
    selectedOption: z.enum(['basic', 'detailed']),
  })
  .superRefine((data, ctx) => {
    if (data.selectedOption === 'detailed') {
      if (!data.address || data.address.trim() === '') {
        ctx.addIssue({
          path: ['address'],
          code: z.ZodIssueCode.custom,
          message: 'Address is required for Detailed Info',
        });
      }

      if (!data.phone || data.phone.trim() === '') {
        ctx.addIssue({
          path: ['phone'],
          code: z.ZodIssueCode.custom,
          message: 'Phone is required for Detailed Info',
        });
      }
    }
  });

const TwoForms = () => {
  const firstForm = useForm<{
    selectedOption: 'basic' | 'detailed';
  }>({
    defaultValues: {
      selectedOption: 'basic',
    },
  });

  const selectedOption = firstForm.watch('selectedOption'); // Track selection

  const secondForm = useForm<z.infer<typeof secondFormSchema>>({
    resolver: zodResolver(secondFormSchema),
    defaultValues: {
      name: '',
      email: '',
      address: '',
      phone: '',
      selectedOption: selectedOption,
    },
  });

  useEffect(() => {
    secondForm.setValue('selectedOption', selectedOption);

    if (selectedOption === 'basic') {
      secondForm.reset({
        name: '',
        email: '',
        address: '',
        phone: '',
        selectedOption: selectedOption,
      });
    }
  }, [selectedOption]);

  const onSubmit = (data: any) => {
    const firstFormValues = firstForm.getValues();
    const secondFormValues = secondForm.getValues();
    action('Form 1 Submitted')(firstFormValues);
    action('Form 2 Submitted')(secondFormValues);

    // Combine both values
    const combinedData = { ...firstFormValues, ...secondFormValues };
    action('All data')(combinedData);
  };

  return (
    <div className="space-y-6">
      <div className="f-10"> First Form</div>
      <Form {...firstForm}>
        <FormField
          control={firstForm.control}
          name="selectedOption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic Info</SelectItem>
                    <SelectItem value="detailed">Detailed Info</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      </Form>
      <Separator orientation="horizontal" />

      {/* Second Form - Fields change based on first form */}
      <form onSubmit={secondForm.handleSubmit(onSubmit)}>
        <Form {...secondForm}>
          <div className="f-10"> Second Form</div>
          <FormField
            control={secondForm.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={secondForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Extra fields for "Detailed Info" option */}
          {selectedOption === 'detailed' && (
            <>
              <FormField
                control={secondForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={secondForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button type="submit" className="mt-4">
            {' '}
            Submit All
          </Button>
        </Form>
      </form>
    </div>
  );
};

// TESTS
/**
 * The default form of the form.
 */
export const Default: Story = {
  render: () => <ProfileForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Submit' })
    );
    await userEvent.click(
      await canvas.findByText('Username must be at least 2 characters.', {
        exact: true,
      })
    );
    await userEvent.click(
      await canvas.findByRole('textbox', { name: 'Username' })
    );
    await userEvent.type(
      await canvas.findByRole('textbox', { name: 'Username' }),
      'test'
    );
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Submit' })
    );
  },
};

export const OptionsBasedOnOtherField: Story = {
  render: () => <DependentSelectForm />,

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    await waitFor(() =>
      expect(
        canvas.queryByRole('combobox', { name: 'Subcategory' })
      ).toBeDisabled()
    );
    await userEvent.click(
      await canvas.findByRole('combobox', { name: 'Category' })
    );
    await userEvent.click(
      await canvas.findByRole('option', { name: 'Fruits' })
    );
    await waitFor(() =>
      expect(
        canvas.queryByRole('combobox', { name: 'Subcategory' })
      ).toBeEnabled()
    );
    await userEvent.click(
      await canvas.findByRole('combobox', { name: 'Subcategory' })
    );
    await userEvent.click(await canvas.findByRole('option', { name: 'Apple' }));
    await waitFor(() =>
      expect(
        canvas.queryByRole('combobox', { name: 'Subcategory' })
      ).toHaveTextContent('Apple')
    );
    await userEvent.click(
      await canvas.findByRole('combobox', { name: 'Category' })
    );
    await userEvent.click(
      await canvas.findByRole('option', { name: 'Vegetables' })
    );
    await userEvent.click(
      await canvas.findByRole('combobox', { name: 'Subcategory' })
    );
    await userEvent.click(
      await canvas.findByRole('option', { name: 'Carrot' })
    );
    await waitFor(() =>
      expect(
        canvas.queryByRole('combobox', { name: 'Subcategory' })
      ).toHaveTextContent('Carrot')
    );
  },
};

export const ConditionalInput: Story = {
  render: () => <ConditionalInputForm />,

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);

    await userEvent.click(
      await canvas.findByRole('button', { name: 'Submit' })
    );
    await userEvent.click(
      await canvas.findByRole('radio', { name: 'Option 1' })
    );
    await userEvent.click(await canvas.findByRole('radio', { name: 'Other' }));
    await userEvent.type(
      await canvas.findByRole('textbox', { name: 'Extra field' }),
      'Test Input'
    );
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Submit' })
    );
  },
};

export const InfoBetweenTwoForms: Story = {
  render: () => <TwoForms />,

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    await waitFor(() =>
      expect(
        canvas.queryByPlaceholderText('Enter your address')
      ).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(
        canvas.queryByPlaceholderText('Enter your phone number')
      ).not.toBeInTheDocument()
    );

    await userEvent.click(await canvas.findByRole('combobox'));
    await userEvent.click(
      await canvas.findByText('Detailed Info', { exact: true })
    );

    await waitFor(() =>
      expect(canvas.getByPlaceholderText('Enter your address')).toBeVisible()
    );
    await waitFor(() =>
      expect(
        canvas.getByPlaceholderText('Enter your phone number')
      ).toBeVisible()
    );
  },
};
