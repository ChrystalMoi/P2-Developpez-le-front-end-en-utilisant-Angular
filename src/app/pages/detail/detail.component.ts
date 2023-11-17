import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country } from 'src/app/pages/models/Country';
import { Participation } from 'src/app/pages/models/Participation';
import { switchMap, map, takeUntil } from 'rxjs/operators';
import { ChartType } from 'chart.js';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})

export class DetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  public lineChartOptions = {
    responsive: true,
  };

  public lineChartLabels: string[] = [];
  public lineChartType: ChartType = 'line';
  public lineChartLegend = true;
  public lineChartData: { data: number[]; label: string }[] = [
    { data: [], label: 'Nombre de médailles par participation' }
  ];
  public selectedCountry: Country | null = null;

  /**
   * Injecte ActivatedRoute et OlympicService dans le constructeur
   * @param route
   * @param olympicService
   * @param router
   */
  constructor(private route: ActivatedRoute, private olympicService: OlympicService, private router: Router) {}

  /**
   * Méthode de rappel qui est invoquée immédiatement après que le détecteur de changement
   * par défaut a vérifié pour la première fois les propriétés liées aux données de la directive,
   * et avant que les enfants de la vue ou du contenu n'aient été vérifiés.
   *
   * Il n'est invoqué qu'une seule fois lorsque la directive est instanciée.
   */
  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        const countryId: number = +params['id'];
        return this.olympicService.getOlympics();
      }),
      map((data: Country[]) => {
        const countryId: number = +this.route.snapshot.params['id'];
        const selectedCountry: Country | undefined = data.find((country: Country) => country.id === countryId);
        return { selectedCountry, countryId };
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(({ selectedCountry, countryId }) => {
      if (selectedCountry) {
        this.selectedCountry = selectedCountry;
        this.lineChartLabels = selectedCountry.participations.map((participation: Participation) => participation.year.toString());
        this.lineChartData[0].data = selectedCountry.participations.map((participation: Participation) => participation.medalsCount);
      }
    });
  }

  /**
   * Méthode de rappel qui effectue un nettoyage personnalisé,
   * invoquée immédiatement avant la destruction d'une directive,
   * d'un canal ou d'une instance de service.
   */
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Méthode pour le bouton retour à la page home
   */
  goBack(): void {
    this.router.navigate(['/home']);

  }

  /**
   * Méthode pour obtenir le total de médailles
   * @returns le nombre de médailles total des participations
   */
  getTotalMedals(): number {
    return this.selectedCountry ? this.selectedCountry.participations.reduce((sum, participation) => sum + participation.medalsCount, 0) : 0;
  }

  /**
   * Méthode pour obtenir le total d'athlètes
   * @returns le nombre d'athlètes total des participations
   */
  getTotalAthletes(): number {
    return this.selectedCountry ? this.selectedCountry.participations.reduce((sum, participation) => sum + participation.athleteCount, 0) : 0;
  }

}
