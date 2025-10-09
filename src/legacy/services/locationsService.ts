import { Country, State } from '@/types/locations';
import { apiService } from './apiService';

export async function getCountries(token: string): Promise<Country[]> {
  const response = await apiService(token, 'locations/countryRegions');
  const countries = (response as Country[])
    .filter((country: Country) => country.countryRegionId !== -1)
    .sort((a: Country, b: Country) => a.country.localeCompare(b.country));
  return countries;
}

export async function getStates(
  token: string,
  countryId: string
): Promise<State[]> {
  const response = await apiService(
    token,
    `locations/stateTerritories/${countryId}`
  );
  const states = (response as State[])
    .filter((state: State) => state.stateTerritoryName !== 'Unknown')
    .sort((a: State, b: State) =>
      a.stateTerritoryName.localeCompare(b.stateTerritoryName)
    );
  return states;
}
