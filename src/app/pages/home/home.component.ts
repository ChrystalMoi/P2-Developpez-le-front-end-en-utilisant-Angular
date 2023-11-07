import { Component, OnInit } from '@angular/core';
//import { Observable, of } from 'rxjs';
//import { OlympicService } from 'src/app/core/services/olympic.service';
import { HttpClient } from '@angular/common/http';
import { ChartDataSets, ChartType } from 'chart.js';

// Interfaces pour définir la structure des données provenant du fichier JSON
interface Participation {
  id: number;
  year: number;
  city: string;
  medalsCount: number;
  athleteCount: number;
}

interface Country {
  id: number;
  country: string;
  participations: Participation[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

//Début class
export class HomeComponent implements OnInit {
  // Options du graphique
  public barChartOptions = {
    // Le graphique s'adaptera à la taille de l'écran
    responsive: true,
  };

  // Libellés (étiquettes) pour l'axe des x du graphique
  // Initialisation de barChartLabels avec un tableau vide
  public barChartLabels: string[] = [];
  //public barChartLabels = ['Label 1', 'Label 2', 'Label 3', 'Label 4'];

  // Type de graphique (Graphique en barres)
  public barChartType: ChartType = 'bar';

  // Afficher la légende du graphique
  public barChartLegend = true;

  // Les données du graphique (initialisées avec un tableau vide)
  public barChartData: ChartDataSets[] = [{ data: [] as number[], label: 'Nombre de médailles' }];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Récupération des données à partir du fichier JSON (olympic.json)
    this.http.get<Country[]>('assets/mock/olympic.json').subscribe(data => {
      if (Array.isArray(data)) {
        // Initialisation d'un tableau pour stocker le total des médailles de chaque pays
        const totalMedalsData: number[] = [];

        // Parcours de la liste des pays
        data.forEach(country => {
          if (Array.isArray(country.participations)) {
            // Calcul du total des médailles pour le pays actuel en utilisant la méthode reduce
            const totalMedals = country.participations.reduce(
              (sum, participation) => sum + participation.medalsCount,
              0
            );

            // Ajout du total des médailles du pays au tableau totalMedalsData
            totalMedalsData.push(totalMedals);
          }

          // Ajout du nom du pays à la liste des libellés du graphique
          this.barChartLabels.push(country.country);
        });

        // Mise à jour des données du graphique avec les totaux de médailles par pays
        this.barChartData[0].data = totalMedalsData;
      }
    });
  }

}
//Fin class
