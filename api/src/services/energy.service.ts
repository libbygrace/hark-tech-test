import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {EnergyData, WeatherData, ResponseData} from '../types';
import csvToJson from 'csvtojson';

@injectable({scope: BindingScope.TRANSIENT})
export class EnergyService {
  constructor(/* Add @inject to inject parameters */) {}

  private async getDataFromCsv(filePath: string) {
    return await csvToJson().fromFile(filePath);
  }

  async getConsumptionData(): Promise<ResponseData[]> {
    const energyData: EnergyData[] = await this.getDataFromCsv(
      '/Users/Libby/Documents/Hark - Engineering Tech Test (3) (1) (3)/api/data/HalfHourlyEnergyData.csv',
    );
    const anomalies: EnergyData[] = await this.getDataFromCsv(
      '/Users/Libby/Documents/Hark - Engineering Tech Test (3) (1) (3)/api/data/HalfHourlyEnergyDataAnomalies.csv',
    );
    const weatherData: WeatherData[] = await this.getDataFromCsv(
      '/Users/Libby/Documents/Hark - Engineering Tech Test (3) (1) (3)/api/data/Weather.csv',
    );

    const formattedWeatherData = weatherData.map(temp => {
      const breakDate = temp.date.split('/');
      const reformatDate = `${breakDate[1]}/${breakDate[0]}/${breakDate[2]}`;
      const date = new Date(reformatDate);
      return {
        ...temp,
        date,
      };
    });

    const combinedData = energyData.map(energy => {
      const date = new Date(energy.timestamp);

      const consumption = parseFloat(energy.consumption);

      const weatherLog = formattedWeatherData.find(
        e => e.date.toISOString() === date.toISOString(),
      );

      const anomalyCheck = anomalies.find(
        e => new Date(e.timestamp).toISOString() === date.toISOString(),
      );

      return {
        date,
        consumption,
        averageTemperature:
          weatherLog && parseFloat(weatherLog.averageTemperature),
        averageHumidity: weatherLog && parseFloat(weatherLog.averageHumidity),
        anomaly: anomalyCheck && parseFloat(anomalyCheck.consumption),
      };
    });

    return combinedData;
  }
}
