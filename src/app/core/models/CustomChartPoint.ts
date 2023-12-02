//import { ChartPoint } from 'chart.js';
import ChartPoint from "chart.js/auto";

export interface CustomChartPoint extends ChartPoint {
  _index?: number;
}
