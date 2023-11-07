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
  public barChartLabels = ['Label 1', 'Label 2', 'Label 3', 'Label 4'];

  // Type de graphique (Graphique en barres)
  public barChartType: ChartType = 'bar';

  // Afficher la légende du graphique
  public barChartLegend = true;

  // Les données du graphique (initialisées avec un tableau vide)
  public barChartData: ChartDataSets[] = [{ data: [] as number[], label: 'Médailles' }];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Récupération des données à partir du fichier JSON (avec chemin vers le olympic.json)
    this.http.get<Country[]>('src/assets/mock/olympic.json').subscribe(data => {

      if (Array.isArray(data)) {
        // Exemple de sélection du premier pays (Italie)
        const selectedCountry = data[0];

        if (selectedCountry && Array.isArray(selectedCountry.participations)) {
          // Extraction des données des médailles du pays sélectionné
          const medalsData = selectedCountry.participations.map(participation => participation.medalsCount) as number[];

          // Mise à jour des données du graphique
          this.barChartData[0].data = medalsData;

          // Mise à jour des libellés du graphique en fonction des années
          this.barChartLabels = selectedCountry.participations.map(participation => participation.year.toString());
        }
      }
    });
  }
}
//Fin class
