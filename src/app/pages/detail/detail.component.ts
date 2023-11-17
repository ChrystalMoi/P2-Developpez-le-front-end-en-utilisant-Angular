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
  public lineChartData: { data: number[]; label: string }[] = [
    { data: [], label: 'Nombre de médailles par participation' }
  ];
  public selectedCountry: Country | null = null;

  // Injecte ActivatedRoute et OlympicService dans le constructeur
  constructor(private route: ActivatedRoute, private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    // Pour écouter les modifications des paramètres de l'URL
    this.route.params.pipe(
      // Utilise "switchMap" pour passer à un nouvel observable (this.olympicService.getOlympics())
      switchMap(params => {
        const countryId: number = +params['id'];

        // Appelle le service pour obtenir les données olympiques
        return this.olympicService.getOlympics().pipe(
          // Utilise map pour traiter les données reçues
          map((data: Country[]) => {
            // Trouve le pays correspondant à l'ID
            const selectedCountry: Country | undefined = data.find((country: Country) => country.id === countryId);
            return { selectedCountry, countryId };
          })
        );
      })

    ).subscribe(({ selectedCountry, countryId }) => {
      // Si le pays est trouvé
      if (selectedCountry) {
        // Maj la propriété selectedCountry
        this.selectedCountry = selectedCountry;

        // Met à jour les labels du graphique avec les années des participations
        this.lineChartLabels = selectedCountry.participations.map((participation: Participation) => participation.year.toString());

        // Maj les données du graphique avec le nombre de médailles par participation
        this.lineChartData[0].data = selectedCountry.participations.map((participation: Participation) => participation.medalsCount);
      }
    });
  }

  //TODO : ajouter le ngDestroy qui se déclanche quand on quitte la page
  // avec le unsubscribe

  //Méthode pour le bouton retour à la page home
  goBack(): void {
    this.router.navigate(['/home']);

  }

  // Méthode pour obtenir le total de médailles (case 2)
  getTotalMedals(): number {
    if (this.selectedCountry && Array.isArray(this.selectedCountry.participations)) {
      return this.selectedCountry.participations.reduce((sum, participation) => sum + participation.medalsCount, 0);
    }
    return 0;
  }

 // Méthode pour obtenir le total d'athlètes (case 3)
  getTotalAthletes(): number {
    if (this.selectedCountry && Array.isArray(this.selectedCountry.participations)) {
      // Utilisation de la fonction reduce pour calculer le total d'athlètes
      const totalAthletes = this.selectedCountry.participations.reduce((sum, participation) => sum + participation.athleteCount, 0);
      return totalAthletes;
    }
    return 0;
  }

}
