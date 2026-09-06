export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string; // State / Province
  admin2?: string; // County / District
  timezone?: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: GeoLocation[];
  generationtime_ms?: number;
}

export interface CurrentWeatherData {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  weather_code: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
}

export interface DailyWeatherData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max?: number[];
  apparent_temperature_min?: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  uv_index_max?: number[];
  sunrise?: string[];
  sunset?: string[];
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: Record<string, string>;
  current: CurrentWeatherData;
  daily_units: Record<string, string>;
  daily: DailyWeatherData;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph';
export type PrecipitationUnit = 'mm' | 'inch';

export interface WeatherCodeInfo {
  code: number;
  description: string;
  icon: string;
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
}

export interface Recommendation {
  id: string;
  type: 'rain' | 'wind' | 'temp-hot' | 'temp-cold' | 'uv' | 'mild';
  severity: 'info' | 'caution' | 'ideal';
  title: string;
  description: string;
  iconName: string;
}

export type ValidationStatus = 'PASS' | 'WARN' | 'FAIL';

export interface QAValidationItem {
  id: string;
  label: string;
  status: ValidationStatus;
  details: string;
}

export interface QATelemetry {
  searchTerm: string;
  resolvedCity: string | null;
  country: string | null;
  resolvedLocation: string | null;
  latitude: number | null;
  longitude: number | null;
  geocodingStatus: 'IDLE' | 'SUCCESS' | 'NO_RESULTS' | 'ERROR';
  forecastStatus: 'IDLE' | 'SUCCESS' | 'ERROR';
  forecastDaysCount: number;
  chartDataAvailable: boolean;
  recommendationsAvailable: boolean;
  recommendationsCount: number;
  lastRetrievedTimestamp: string | null;
  rawCoords: { lat: number; lon: number } | null;
  errorMessage?: string | null;
}

export interface AssignmentTestCase {
  id: 'TEST_01' | 'TEST_02' | 'TEST_03';
  code: string;
  title: string;
  input: string;
  expected: string;
  status: 'NOT TESTED' | 'PASS' | 'FAIL';
  observedAt?: string;
  evidenceNotes?: string;
}

export interface ManualTestItem {
  id: string;
  testKey: 'TEST_A' | 'TEST_B' | 'TEST_C';
  title: string;
  city: string;
  expected: string;
  status: 'NOT TESTED' | 'PASS' | 'FAIL';
  testedAt?: string;
  notes?: string;
}
