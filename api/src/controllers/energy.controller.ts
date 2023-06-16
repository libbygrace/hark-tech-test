// Uncomment these imports to begin using these cool features!
import {get} from '@loopback/rest';
import {EnergyService} from '../services/energy.service';
import {ResponseData} from '../types';
import {inject, service} from '@loopback/core';

export class EnergyController {
  constructor(@service(EnergyService) public energyService: EnergyService) {}
  @get('/energy')
  energy(): Promise<ResponseData[]> {
    return this.energyService.getConsumptionData();
  }
}
