import { ChartPoint } from 'chart.js';

export interface CustomChartPoint extends ChartPoint {
  _index?: number;
}
