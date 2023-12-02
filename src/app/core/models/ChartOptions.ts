import ChartPoint from "chart.js/auto";

export interface ChartOptions {
  responsive: boolean;
  onClick: (event: MouseEvent, chartElements: ChartPoint[]) => void;
}
