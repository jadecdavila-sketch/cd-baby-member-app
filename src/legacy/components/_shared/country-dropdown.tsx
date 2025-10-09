// components/CountryStateSelect.tsx
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';
import { useFormContext } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/form';
import { Country, State } from '@/types/locations';
import { getCountries, getStates } from '@/legacy/services/locationsService';
import type { Control, UseFormSetValue } from 'react-hook-form';

type Props = {
  countryFieldName: string;
  stateFieldName: string;
  showStateSelect?: boolean;
};

type CountrySelectFieldProps = {
  control: Control<any>;
  countryFieldName: string;
  stateFieldName: string;
  setValue: UseFormSetValue<any>;
  countries: Country[];
};

const CountrySelectField = ({
  control,
  countryFieldName,
  stateFieldName,
  setValue,
  countries,
}: CountrySelectFieldProps) => (
  <FormField
    control={control}
    name={countryFieldName}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Country</FormLabel>
        <Select
          onValueChange={(val) => {
            field.onChange(val);
            setValue(stateFieldName, undefined); // Reset state when country changes
          }}
          value={field.value}
        >
          <FormControl>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {countries.map((c: Country) => (
              <SelectItem
                key={c.countryRegionId}
                value={String(c.countryRegionId)}
              >
                {c.country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

type StateSelectFieldProps = {
  control: Control<any>;
  stateFieldName: string;
  selectedCountry: string | undefined;
  states: State[];
};

const StateSelectField = ({
  control,
  stateFieldName,
  selectedCountry,
  states,
}: StateSelectFieldProps) => (
  <FormField
    control={control}
    name={stateFieldName}
    render={({ field }) => (
      <FormItem>
        <FormLabel>State/Province</FormLabel>
        <Select
          onValueChange={field.onChange}
          value={field.value}
          disabled={!selectedCountry}
        >
          <FormControl>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {states.map((s: State) => (
              <SelectItem
                key={s.stateTerritoryId}
                value={String(s.stateTerritoryId)}
              >
                {s.stateTerritoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

type FormProps = Props & {
  countries?: Country[];
  states?: State[];
  selectedCountry?: string | undefined;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
};

export const CountryStateForm = ({
  countries,
  states,
  selectedCountry,
  control,
  setValue,
  countryFieldName,
  stateFieldName,
  showStateSelect = true,
}: FormProps) => {
  return (
    <div className="grid gap-4">
      <CountrySelectField
        control={control}
        countryFieldName={countryFieldName}
        stateFieldName={stateFieldName}
        setValue={setValue}
        countries={countries || []}
      />
      {showStateSelect && (
        <StateSelectField
          control={control}
          stateFieldName={stateFieldName}
          selectedCountry={selectedCountry}
          states={states || []}
        />
      )}
    </div>
  );
};

export const CountryStateSelect = ({
  countryFieldName,
  stateFieldName,
  showStateSelect,
}: Props) => {
  const { control, setValue, watch } = useFormContext();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const selectedCountry = watch(countryFieldName);

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);

  useEffect(() => {
    if (!accessToken) return;
    getCountries(accessToken)
      .then((data) => setCountries(data))
      .catch((err) => console.error('Failed to fetch countries', err));
  }, [accessToken]);

  useEffect(() => {
    if (!selectedCountry || !accessToken) return;
    setStates([]); // Reset states when country changes
    getStates(accessToken, selectedCountry)
      .then((data) => setStates(data))
      .catch((err) => console.error('Failed to fetch states', err));
  }, [selectedCountry, accessToken]);

  return (
    <CountryStateForm
      selectedCountry={selectedCountry}
      control={control}
      setValue={setValue}
      countryFieldName={countryFieldName}
      stateFieldName={stateFieldName}
      showStateSelect={showStateSelect}
      countries={countries}
      states={states}
    />
  );
};
