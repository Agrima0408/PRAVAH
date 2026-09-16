import { useEffect, useState } from "react";
import { getWeather, type WeatherApiResponse } from "@/lib/api/weather";

type WeatherState = {
  data: WeatherApiResponse | null;
  loading: boolean;
  error: string | null;
};

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadWeather() {
      try {
        const data = await getWeather();
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : "Unable to load weather data",
          });
        }
      }
    }

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
