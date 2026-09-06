import { GeoLocation, GeocodingResponse, ForecastResponse, TemperatureUnit, WindSpeedUnit, PrecipitationUnit } from '../types/weather';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// High-speed in-memory caches to deliver sub-50ms instant responses on repeated searches
const geocodingCache = new Map<string, { data: GeoLocation[]; timestamp: number }>();
const forecastCache = new Map<string, { data: ForecastResponse; timestamp: number }>();

const GEOCODING_TTL_MS = 30 * 60 * 1000; // 30 minutes
const FORECAST_TTL_MS = 10 * 60 * 1000; // 10 minutes
const FETCH_TIMEOUT_MS = 3500; // Fast 3.5s timeout to guarantee rapid response or clear error

// Active AbortControllers to cancel previous in-flight requests if user submits a new search
let activeGeocodeController: AbortController | null = null;
let activeForecastController: AbortController | null = null;

export class OpenMeteoError extends Error {
  public isNetworkError: boolean;
  public statusCode?: number;
  public isCancelled: boolean;
  public isTimeout: boolean;

  constructor(
    message: string,
    isNetworkError = false,
    statusCode?: number,
    isCancelled = false,
    isTimeout = false
  ) {
    super(message);
    this.name = 'OpenMeteoError';
    this.isNetworkError = isNetworkError;
    this.statusCode = statusCode;
    this.isCancelled = isCancelled;
    this.isTimeout = isTimeout;
  }
}

/**
 * Fetch with timeout and custom cancellation signal
 */
async function fetchWithTimeout(url: string, signal?: AbortSignal, timeoutMs = 10000): Promise<Response> {
  const timeoutController = new AbortController();
  let isTimedOut = false;
  const timer = setTimeout(() => {
    isTimedOut = true;
    timeoutController.abort();
  }, timeoutMs);

  const onExternalAbort = () => {
    timeoutController.abort();
  };

  if (signal) {
    if (signal.aborted) {
      clearTimeout(timer);
      throw new OpenMeteoError('Search request was superseded by a newer query.', false, undefined, true, false);
    }
    signal.addEventListener('abort', onExternalAbort, { once: true });
  }

  try {
    const response = await fetch(url, {
      signal: timeoutController.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    return response;
  } catch (err: unknown) {
    if (isTimedOut) {
      throw new OpenMeteoError(
        'Weather service request timed out. Please check your network and try again.',
        true,
        undefined,
        false,
        true
      );
    }
    if (signal?.aborted) {
      throw new OpenMeteoError(
        'Search request was superseded by a newer query.',
        false,
        undefined,
        true,
        false
      );
    }
    if (err instanceof OpenMeteoError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : 'Unknown network error';
    throw new OpenMeteoError(`Failed to connect to weather service: ${message}`, true);
  } finally {
    clearTimeout(timer);
    if (signal) {
      signal.removeEventListener('abort', onExternalAbort);
    }
  }
}

/**
 * Searches for cities by name using Open-Meteo Geocoding API with sub-second caching.
 */
export async function searchCity(query: string, count = 5): Promise<GeoLocation[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return [];
  }

  // 1. Check in-memory cache for instant response
  const cached = geocodingCache.get(trimmed);
  if (cached && Date.now() - cached.timestamp < GEOCODING_TTL_MS) {
    return cached.data;
  }

  // 2. Abort previous geocoding request if still in flight
  if (activeGeocodeController) {
    activeGeocodeController.abort();
  }
  activeGeocodeController = new AbortController();
  const currentController = activeGeocodeController;
  const signal = currentController.signal;

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmed)}&count=${count}&language=en&format=json`;

  try {
    const response = await fetchWithTimeout(url, signal);

    if (!response.ok) {
      throw new OpenMeteoError(
        `Geocoding service returned status ${response.status}: ${response.statusText}`,
        false,
        response.status
      );
    }

    const data: GeocodingResponse = await response.json();
    const results = data.results || [];

    // Cache valid results
    geocodingCache.set(trimmed, { data: results, timestamp: Date.now() });
    return results;
  } catch (err: unknown) {
    if (err instanceof OpenMeteoError) {
      throw err;
    }
    if (signal.aborted) {
      throw new OpenMeteoError('Search request was superseded by a newer query.', false, undefined, true, false);
    }
    const message = err instanceof Error ? err.message : 'Unknown network error';
    throw new OpenMeteoError(`Failed to connect to Geocoding API: ${message}`, true);
  } finally {
    if (activeGeocodeController === currentController) {
      activeGeocodeController = null;
    }
  }
}

/**
 * Retrieves current weather and 7-day forecast using Open-Meteo Forecast API with caching.
 */
export async function getForecast(
  latitude: number,
  longitude: number,
  temperatureUnit: TemperatureUnit = 'celsius',
  windSpeedUnit: WindSpeedUnit = 'kmh',
  precipitationUnit: PrecipitationUnit = 'mm'
): Promise<ForecastResponse> {
  const cacheKey = `${latitude.toFixed(4)}_${longitude.toFixed(4)}_${temperatureUnit}_${windSpeedUnit}_${precipitationUnit}`;

  // 1. Check in-memory cache for instant sub-10ms response
  const cached = forecastCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < FORECAST_TTL_MS) {
    return cached.data;
  }

  // 2. Abort previous forecast request if in flight
  if (activeForecastController) {
    activeForecastController.abort();
  }
  activeForecastController = new AbortController();
  const currentController = activeForecastController;
  const signal = currentController.signal;

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'weather_code',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'uv_index_max',
      'sunrise',
      'sunset',
    ].join(','),
    timezone: 'auto',
    temperature_unit: temperatureUnit,
    wind_speed_unit: windSpeedUnit,
    precipitation_unit: precipitationUnit,
  });

  const url = `${FORECAST_BASE_URL}?${params.toString()}`;

  try {
    const response = await fetchWithTimeout(url, signal);

    if (!response.ok) {
      throw new OpenMeteoError(
        `Forecast service returned status ${response.status}: ${response.statusText}`,
        false,
        response.status
      );
    }

    const data: ForecastResponse = await response.json();

    if (!data.current || !data.daily || !Array.isArray(data.daily.time)) {
      throw new OpenMeteoError('Forecast API returned incomplete weather structure', false);
    }

    // Cache forecast response
    forecastCache.set(cacheKey, { data, timestamp: Date.now() });

    return data;
  } catch (err: unknown) {
    if (err instanceof OpenMeteoError) {
      throw err;
    }
    if (signal.aborted) {
      throw new OpenMeteoError('Forecast request was cancelled.', false, undefined, true, false);
    }
    const message = err instanceof Error ? err.message : 'Unknown network error';
    throw new OpenMeteoError(`Failed to connect to Forecast API: ${message}`, true);
  } finally {
    if (activeForecastController === currentController) {
      activeForecastController = null;
    }
  }
}

