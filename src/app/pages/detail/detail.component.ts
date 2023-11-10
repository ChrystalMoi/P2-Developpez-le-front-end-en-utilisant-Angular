import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country } from 'src/app/pages/models/Country';
import { Participation } from 'src/app/pages/models/Participation';
import { switchMap, map } from 'rxjs/operators';
import { ChartType } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})

export class DetailComponent implements OnInit {
  public lineChartOptions = {
    responsive: true,
  };

  public lineChartLabels: string[] = [];
  public lineChartType: ChartType = 'line';
  public lineChartLegend = true;
  public lineChartData: any[] = [{ data: [] as number[], label: 'Nombre de médailles par participation' }];
  //public selectedCountry: string = '';
  public selectedCountry: Country | null = null;

  // Injecte ActivatedRoute et OlympicService dans le constructeur
  constructor(private route: ActivatedRoute, private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        const countryId: number = +params['id']+1;
        return this.olympicService.getOlympics().pipe(
          map((data: Country[]) => {
            const selectedCountry: Country | undefined = data.find((country: Country) => country.id === countryId);
            return { selectedCountry, countryId };
          })
        );
      })
    ).subscribe(({ selectedCountry, countryId }) => {
      if (selectedCountry) {
        this.selectedCountry = selectedCountry;
        this.lineChartLabels = selectedCountry.participations.map((participation: Participation) => participation.year.toString());
        this.lineChartData[0].data = selectedCountry.participations.map((participation: Participation) => participation.medalsCount);
      }
    });
  }

  goBack(): void {
    // Utilisez le service Router pour naviguer vers la page d'accueil
    this.router.navigate(['/home']);
  }
}
