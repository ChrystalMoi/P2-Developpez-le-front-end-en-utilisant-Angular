import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country } from 'src/app/core/models/Country';
import { Participation } from 'src/app/core/models/Participation';
import { map } from 'rxjs/operators';
import { Chart, ChartType } from 'chart.js';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MedalService } from 'src/app/core/services/medal.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})

export class DetailComponent implements OnInit, OnDestroy {
  private souscription! : Subscription;

  public lineChartOptions = {
    responsive: true,
  };

  public lineChartLabels: string[] = [];
  public lineChartType: ChartType = 'line';
  public lineChartData: { data: number[]; label: string }[] = [
    { data: [], label: 'Nombre de médailles par participation' }
  ];
  public selectedCountry: Country | null = null;

  /**
   * Injecte ActivatedRoute, Router et MedalService et OlympicService dans le constructeur
   * @param route
   * @param olympicService
   * @param router
   * @param medalService
   */
  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private router: Router,
    private medalService: MedalService,
  ) {}

  private chart: Chart | undefined;

  /**
   * Méthode de rappel qui est invoquée immédiatement après que le détecteur de changement
   * par défaut a vérifié pour la première fois les propriétés liées aux données de la directive,
   * et avant que les enfants de la vue ou du contenu n'aient été vérifiés.
   *
   * Il n'est invoqué qu'une seule fois lorsque la directive est instanciée.
   */
  ngOnInit(): void {
    this.souscription = this.olympicService.getOlympics().pipe(
      //transforme en observable d'un pays
      map((data: Country[]) => {
        const countryId: number = +this.route.snapshot.params['id'];
        const selectedCountry: Country | undefined = data.find((country: Country) => country.id === countryId);
        return { selectedCountry };
      })

    ).subscribe(({ selectedCountry }) => {
      if (selectedCountry) {
        this.selectedCountry = selectedCountry;
        this.lineChartLabels = selectedCountry.participations.map((participation: Participation) => participation.year.toString());
        this.lineChartData[0].data = selectedCountry.participations.map((participation: Participation) => participation.medalsCount);

        // Mise à jour du service des médailles avec le nombre total de médailles par participation
        const totalMedalsByParticipation = selectedCountry.participations.reduce((sum, participation) => sum + participation.medalsCount, 0);
        this.medalService.updateMedalCount(totalMedalsByParticipation);
      }
    });

    // Initialisation du graphique après que les données soit disponibles
    this.initChart();

    // Mise à jour du graphique après avoir initialisé les données
    this.chart?.update();
  }

  private initChart(): void{
    const canvasElement = document.getElementById('chartDetail') as HTMLCanvasElement;
    this.chart = new Chart(canvasElement, {
      type : this.lineChartType,
      data: {
        labels: this.lineChartLabels,
        datasets: [{
          data: this.lineChartData[0].data,
          label: this.lineChartData[0].label,
          borderColor: '#00838F', // Couleur de la ligne
          backgroundColor: '#00838F', // Couleur de fond de la ligne
          borderWidth: 2, // Largeur de la bordure
          pointRadius: 6, // Taille des points
          pointBackgroundColor: '#00838F', // Couleur des points
          pointHoverRadius: 8, // Taille des points au survol
          pointHoverBackgroundColor: '#ff0000', // Couleur des points au survol
          borderCapStyle: 'round', // Style de la bordure à l'extrémité de la ligne (arrondi)
          borderJoinStyle: 'round', // Style de la bordure aux jonctions des segments (arrondi)
          tension: 0.3, // Tension de la courbe
        }],
      },
      options: this.lineChartOptions
    })
  }

  /**
   * Méthode de rappel qui effectue un nettoyage personnalisé,
   * invoquée immédiatement avant la destruction d'une directive,
   * d'un canal ou d'une instance de service.
   */
  ngOnDestroy(): void {
    this.souscription.unsubscribe();
  }

  /**
   * Méthode pour le bouton retour à la page home (accueil)
   */
  goBack(): void {
    this.router.navigate(['/']);
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
