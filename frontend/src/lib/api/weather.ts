export type WeatherApiResponse = {
  latitude: number;
  longitude: number;
  current?: {
    time?: string;
    interval?: number;
    rain?: number;
    precipitation?: number;
    temperature_2m?: number;
  };
  hourly?: {
    time?: string[];
    rain?: number[];
    precipitation?: number[];
    precipitation_probability?: number[];
    temperature_2m?: number[];
  };
};

const WEATHER_API_URL =
  "https://pravah-ergp.onrender.com/api/weather";;

export async function getWeather(): Promise<WeatherApiResponse> {
  const response = await fetch(WEATHER_API_URL);

  if (!response.ok) {
    throw new Error(`Weather request failed with status ${response.status}`);
  }

  return response.json() as Promise<WeatherApiResponse>;
}
