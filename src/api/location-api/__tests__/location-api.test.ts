import { locationApi } from '../location-api';
import { api } from '../../api';
import { Country, State } from '@/shared/types/locations';

// Mock the external API
vi.mock('../../api');

describe('locationApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getCountries', () => {
    it('returns filtered and sorted countries', async () => {
      // Arrange
      const mockCountries: Country[] = [
        { countryRegionId: 3, country: 'Canada' },
        { countryRegionId: -1, country: 'Invalid Country' }, // Should be filtered out
        { countryRegionId: 1, country: 'United States' },
        { countryRegionId: 2, country: 'Australia' },
      ];

      const expectedCountries: Country[] = [
        { countryRegionId: 2, country: 'Australia' },
        { countryRegionId: 3, country: 'Canada' },
        { countryRegionId: 1, country: 'United States' },
      ];

      vi.mocked(api.get).mockResolvedValue({ data: mockCountries });

      // Act
      const result = await locationApi.getCountries();

      // Assert
      expect(api.get).toHaveBeenCalledWith('locations/countryRegions');
      expect(result).toEqual(expectedCountries);
      expect(result).toHaveLength(3); // Filtered out the -1 entry
    });

    it('handles empty response', async () => {
      // Arrange
      vi.mocked(api.get).mockResolvedValue({ data: [] });

      // Act
      const result = await locationApi.getCountries();

      // Assert
      expect(result).toEqual([]);
    });

    it('handles null/undefined response data', async () => {
      // Arrange
      vi.mocked(api.get).mockResolvedValue({ data: null });

      // Act
      const result = await locationApi.getCountries();

      // Assert
      expect(result).toEqual([]);
    });

    it('throws error when API call fails', async () => {
      // Arrange
      const apiError = new Error('Network error');
      vi.mocked(api.get).mockRejectedValue(apiError);

      // Act & Assert
      await expect(locationApi.getCountries()).rejects.toThrow(
        'Failed to get countries'
      );
    });

    it('filters out countries with countryRegionId -1', async () => {
      // Arrange
      const mockCountries: Country[] = [
        { countryRegionId: -1, country: 'Invalid 1' },
        { countryRegionId: 1, country: 'Valid Country' },
        { countryRegionId: -1, country: 'Invalid 2' },
      ];

      vi.mocked(api.get).mockResolvedValue({ data: mockCountries });

      // Act
      const result = await locationApi.getCountries();

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        countryRegionId: 1,
        country: 'Valid Country',
      });
    });

    it('sorts countries alphabetically by name', async () => {
      // Arrange
      const mockCountries: Country[] = [
        { countryRegionId: 1, country: 'Zimbabwe' },
        { countryRegionId: 2, country: 'Australia' },
        { countryRegionId: 3, country: 'Brazil' },
        { countryRegionId: 4, country: 'Austria' },
      ];

      vi.mocked(api.get).mockResolvedValue({ data: mockCountries });

      // Act
      const result = await locationApi.getCountries();

      // Assert
      expect(result.map((c) => c.country)).toEqual([
        'Australia',
        'Austria',
        'Brazil',
        'Zimbabwe',
      ]);
    });
  });

  describe('getStates', () => {
    it('returns filtered and sorted states for a country', async () => {
      // Arrange
      const countryId = '1';
      const mockStates: State[] = [
        { stateTerritoryId: 3, stateTerritoryName: 'Texas' },
        { stateTerritoryId: -1, stateTerritoryName: 'Unknown' }, // Should be filtered out
        { stateTerritoryId: 1, stateTerritoryName: 'California' },
        { stateTerritoryId: 2, stateTerritoryName: 'New York' },
      ];

      const expectedStates: State[] = [
        { stateTerritoryId: 1, stateTerritoryName: 'California' },
        { stateTerritoryId: 2, stateTerritoryName: 'New York' },
        { stateTerritoryId: 3, stateTerritoryName: 'Texas' },
      ];

      vi.mocked(api.get).mockResolvedValue({ data: mockStates });

      // Act
      const result = await locationApi.getStates(countryId);

      // Assert
      expect(api.get).toHaveBeenCalledWith(
        `locations/stateTerritories/${countryId}`
      );
      expect(result).toEqual(expectedStates);
      expect(result).toHaveLength(3); // Filtered out the 'Unknown' entry
    });

    it('handles empty states response', async () => {
      // Arrange
      const countryId = '999';
      vi.mocked(api.get).mockResolvedValue({ data: [] });

      // Act
      const result = await locationApi.getStates(countryId);

      // Assert
      expect(result).toEqual([]);
    });

    it('handles null/undefined response data', async () => {
      // Arrange
      const countryId = '1';
      vi.mocked(api.get).mockResolvedValue({ data: null });

      // Act
      const result = await locationApi.getStates(countryId);

      // Assert
      expect(result).toEqual([]);
    });

    it('throws error when API call fails', async () => {
      // Arrange
      const countryId = '1';
      const apiError = new Error('Network error');
      vi.mocked(api.get).mockRejectedValue(apiError);

      // Act & Assert
      await expect(locationApi.getStates(countryId)).rejects.toThrow(
        'Failed to get states'
      );
    });

    it('filters out states with name "Unknown"', async () => {
      // Arrange
      const countryId = '1';
      const mockStates: State[] = [
        { stateTerritoryId: 1, stateTerritoryName: 'California' },
        { stateTerritoryId: -1, stateTerritoryName: 'Unknown' },
        { stateTerritoryId: 2, stateTerritoryName: 'Texas' },
        { stateTerritoryId: -2, stateTerritoryName: 'Unknown' }, // Multiple unknowns
      ];

      vi.mocked(api.get).mockResolvedValue({ data: mockStates });

      // Act
      const result = await locationApi.getStates(countryId);

      // Assert
      expect(result).toHaveLength(2);
      expect(
        result.every((state) => state.stateTerritoryName !== 'Unknown')
      ).toBe(true);
    });

    it('sorts states alphabetically by name', async () => {
      // Arrange
      const countryId = '1';
      const mockStates: State[] = [
        { stateTerritoryId: 1, stateTerritoryName: 'Wyoming' },
        { stateTerritoryId: 2, stateTerritoryName: 'Alabama' },
        { stateTerritoryId: 3, stateTerritoryName: 'Florida' },
        { stateTerritoryId: 4, stateTerritoryName: 'Alaska' },
      ];

      vi.mocked(api.get).mockResolvedValue({ data: mockStates });

      // Act
      const result = await locationApi.getStates(countryId);

      // Assert
      expect(result.map((s) => s.stateTerritoryName)).toEqual([
        'Alabama',
        'Alaska',
        'Florida',
        'Wyoming',
      ]);
    });

    it('handles country ID as string parameter correctly', async () => {
      // Arrange
      const countryId = '123';
      const mockStates: State[] = [
        { stateTerritoryId: 1, stateTerritoryName: 'State 1' },
      ];

      vi.mocked(api.get).mockResolvedValue({ data: mockStates });

      // Act
      await locationApi.getStates(countryId);

      // Assert
      expect(api.get).toHaveBeenCalledWith('locations/stateTerritories/123');
    });

    it('handles special characters in state names', async () => {
      // Arrange
      const countryId = '1';
      const mockStates: State[] = [
        { stateTerritoryId: 1, stateTerritoryName: 'Île-de-France' },
        { stateTerritoryId: 2, stateTerritoryName: 'Auvergne-Rhône-Alpes' },
        { stateTerritoryId: 3, stateTerritoryName: 'Baden-Württemberg' },
      ];

      vi.mocked(api.get).mockResolvedValue({ data: mockStates });

      // Act
      const result = await locationApi.getStates(countryId);

      // Assert
      expect(result).toHaveLength(3);
      expect(result.map((s) => s.stateTerritoryName)).toEqual([
        'Auvergne-Rhône-Alpes',
        'Baden-Württemberg',
        'Île-de-France',
      ]);
    });
  });
});
