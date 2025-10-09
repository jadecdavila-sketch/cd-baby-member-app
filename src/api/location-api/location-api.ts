import { Country, State } from '@/shared/types/locations';

import { api } from '../api';

export const locationApi = {
  async getCountries(): Promise<Country[]> {
    try {
      const response = await api.get<Country[]>('locations/countryRegions');
      const countries = (response.data || [])
        .filter((country: Country) => country.countryRegionId !== -1)
        .sort((a: Country, b: Country) => a.country.localeCompare(b.country));
      return countries;
    } catch {
      throw new Error('Failed to get countries');
    }
  },

  async getStates(countryId: string): Promise<State[]> {
    try {
      const response = await api.get<State[]>(
        `locations/stateTerritories/${countryId}`
      );
      const states = (response.data || [])
        .filter((state: State) => state.stateTerritoryName !== 'Unknown')
        .sort((a: State, b: State) =>
          a.stateTerritoryName.localeCompare(b.stateTerritoryName)
        );
      return states;
    } catch {
      throw new Error('Failed to get states');
    }
  },
};
