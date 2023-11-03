import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  public olympics$!: Observable<any>;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
  }

  ngAfterViewInit(): void {
    this.olympics$.subscribe((data) => {
      if (data) {
        const countries = data.map((item: any) => item.country);
        const medalsCount = data.map((item: any) =>
          item.participations.reduce((acc: number, curr: any) => acc + curr.medalsCount, 0)
        );

        const ctx = document.getElementById('medalsChart') as HTMLCanvasElement;
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: countries,
            datasets: [
              {
                label: 'Nombre total de médailles',
                data: medalsCount,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    });
  }
}
