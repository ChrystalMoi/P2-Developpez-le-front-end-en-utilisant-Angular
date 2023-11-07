import { Component, OnInit } from '@angular/core';
//import { Observable, of } from 'rxjs';
//import { OlympicService } from 'src/app/core/services/olympic.service';
import { HttpClient } from '@angular/common/http';
import { ChartDataSets, ChartType, ChartColor } from 'chart.js';
import { Color } from 'ng2-charts';

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

type CountryClassMap = { [key: string]: string };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
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

  // Type de graphique (Graphique en cercle)
  public barChartType: ChartType = 'pie';

  // Afficher la légende du graphique
  public barChartLegend = true;

  // Les données du graphique (initialisées avec un tableau vide)
  public barChartData: ChartDataSets[] = [{ data: [] as number[], label: 'Nombre de médailles' }];

  public barChartColors: Color[] = [
    {
      backgroundColor: [
        '#FF0000',  // France
        '#0000FF',  // Italy
        '#FFFF00',  // Spain
        '#00FF00',  // United States
        '#7F00FF',  // Germany
      ],
    },
  ];
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
