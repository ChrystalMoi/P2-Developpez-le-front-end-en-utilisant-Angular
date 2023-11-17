import { ChartPoint } from 'chart.js';

export interface ChartOptions {
  responsive: boolean;
  onClick: (event: MouseEvent, chartElements: ChartPoint[]) => void;
}
