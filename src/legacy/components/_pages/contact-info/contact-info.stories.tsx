import { ContactInfoForm, formSchema } from './contact-info';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Country, State } from '@/types/locations';
import { CountryStateForm } from '@/components/_shared/country-dropdown';
import { StoryObj, Meta } from '@storybook/react';

const MockCountries: Country[] = [
  { countryRegionId: 1, country: 'United States' },
  { countryRegionId: 2, country: 'Canada' },
  { countryRegionId: 3, country: 'Mexico' },
  { countryRegionId: 4, country: 'United Kingdom' },
  { countryRegionId: 5, country: 'Australia' },
  { countryRegionId: 6, country: 'Germany' },
  { countryRegionId: 7, country: 'France' },
  { countryRegionId: 8, country: 'Japan' },
  { countryRegionId: 9, country: 'China' },
  { countryRegionId: 10, country: 'India' },
  { countryRegionId: 11, country: 'Brazil' },
  { countryRegionId: 12, country: 'South Africa' },
];

const MockStates: State[] = [
  { stateTerritoryId: 1, stateTerritoryName: 'California' },
  { stateTerritoryId: 2, stateTerritoryName: 'Texas' },
  { stateTerritoryId: 3, stateTerritoryName: 'New York' },
  { stateTerritoryId: 4, stateTerritoryName: 'Ontario' },
  { stateTerritoryId: 5, stateTerritoryName: 'Quebec' },
  { stateTerritoryId: 6, stateTerritoryName: 'Bavaria' },
  { stateTerritoryId: 7, stateTerritoryName: 'New South Wales' },
  { stateTerritoryId: 8, stateTerritoryName: 'Île-de-France' },
  { stateTerritoryId: 9, stateTerritoryName: 'Tokyo' },
  { stateTerritoryId: 10, stateTerritoryName: 'Maharashtra' },
  { stateTerritoryId: 11, stateTerritoryName: 'São Paulo' },
  { stateTerritoryId: 12, stateTerritoryName: 'Gauteng' },
];

const meta: Meta<typeof ContactInfoForm> = {
  title: 'pages/ContactInfoPage',
  component: ContactInfoForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  render: () => {
    // Mock useForm with default values
    const mockForm = useForm<z.infer<typeof formSchema>>({
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
    const mockOnSubmit = async (
      data: z.infer<typeof formSchema>
    ): Promise<void> => {
      console.log('Form submitted with data:', data);
      // Simulate a successful submission
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    };
    return (
      <ContactInfoForm
        onSubmit={mockOnSubmit}
        form={mockForm}
        ContactInfoCountryStateSelectField={
          <CountryStateForm
            countries={MockCountries}
            states={MockStates}
            selectedCountry={mockForm.watch('country')}
            control={mockForm.control}
            setValue={mockForm.setValue}
            countryFieldName="country"
            stateFieldName="region"
            showStateSelect={true}
          />
        }
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
