export interface EnergyData {
  timestamp: string;
  consumption: string;
}

export interface WeatherData {
  date: string;
  averageTemperature: string;
  averageHumidity: string;
}

export interface ResponseData {
  date: Date;
  consumption: number;
  averageTemperature?: number;
  averageHumidity?: number;
  anomaly?: number;
}
