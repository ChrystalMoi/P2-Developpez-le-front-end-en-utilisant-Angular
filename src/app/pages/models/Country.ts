import { Participation } from './Participation';

export interface Country {
  id: number;
  country: string;
  participations: Participation[];
}
