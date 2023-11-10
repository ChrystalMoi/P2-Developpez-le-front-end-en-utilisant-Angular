import { Component, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ChartDataSets, ChartType } from 'chart.js';
import { Color } from 'ng2-charts';
import { Country } from 'src/app/pages/models/Country';
import { ChartCountry } from 'src/app/pages/models/ChartCountry';
import { Participation } from 'src/app/pages/models/Participation';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

// Début de la classe du composant
export class HomeComponent implements OnInit {
  // Options du graphique
  public chartOptions = {
    responsive: true, // Le graphique s'adaptera à la taille de l'écran

    onClick: (event: any, chartElements: any[]) => {
      if (chartElements && chartElements.length > 0) {
        const clickedIndex = chartElements[0]._index;
        this.selectedCountryId = clickedIndex;

        // Navigue vers la page de détail en utilisant le Router
        this.router.navigate(['/detail', this.selectedCountryId]);
      }
    }
  };

  // Libellés (étiquettes) pour l'axe des x du graphique ; Initialisation de chartLabels avec un tableau vide
  public chartLabels: string[] = [];

  // Type de graphique (Graphique en cercle (pie) ou donut (doughnut))
  public chartType: ChartType = 'pie';

  // Afficher la légende du graphique
  public chartLegend = true;

  // Les données du graphique (initialisées avec un tableau vide)
  public chartData: ChartDataSets[] = [{ data: [] as number[], label: 'Nombre de médailles' }];

  // Couleurs spécifiées pour chaque segment du graphique
  public chartColors: Color[] = [
    {
      backgroundColor: [
        '#9780A1',  // France
        '#956065',  // Italy
        '#B8CBE7',  // Spain
        '#89A1DB',  // United States
        '#793D52',  // Germany
      ],
    },
  ];

  // Injection du service OlympicService dans le constructeur
  constructor(private olympicService: OlympicService, private router: Router) {}

  // Ajoute une propriété pour stocker l'ID du pays sélectionné
  selectedCountryId: number | null = null;

  // Méthode ngOnInit qui est appelée lors de l'initialisation du composant
  ngOnInit(): void {

    // Appel à la méthode getOlympics du service OlympicService pour récupérer les données
    this.olympicService.getOlympics().subscribe((data) => {

       // Vérification si les données sont un tableau
      if (Array.isArray(data)) {

        // Initialisation d'un tableau pour stocker le total des médailles de chaque pays
        const totalMedalsData: number[] = [];

        // Parcours de la liste des pays
        data.forEach((country) => {
          console.log('Country data:', country);

          // Vérification si le pays a une liste de participations
          if (Array.isArray(country.participations)) {
            // Calcul du total des médailles pour le pays en utilisant la méthode reduce
            const totalMedals = country.participations.reduce(
              (sum: number, participation: Participation) => sum + participation.medalsCount,
              0
            );

            // Ajout du total des médailles du pays au tableau totalMedalsData
            totalMedalsData.push(totalMedals);
          }

          // Ajout du nom du pays à la liste des libellés du graphique
          this.chartLabels.push(country.country);

          // Stocke l'ID du pays dans la propriété selectedCountryId
          const countryId = country.id;

          // Ajoute un gestionnaire d'événements pour chaque pays
          this.chartOptions.onClick = (event, chartElements) => {
            if (chartElements && chartElements.length > 0) {
              const clickedIndex = chartElements[0]._index;
              this.selectedCountryId = clickedIndex;

              // Navigue vers la page de détail en utilisant le Router
              this.router.navigate(['/detail', this.selectedCountryId]);
            }
          };
        });

        // Mise à jour des données du graphique avec les totaux de médailles par pays
        this.chartData[0].data = totalMedalsData;
      }
    });
  }

  // Méthode appelée lorsqu'un segment du graphique est cliqué
  onChartClick(event: any, chartElements: any[]) {
    if (chartElements && chartElements.length > 0) {
      const clickedIndex = chartElements[0]._index;

      // Assurez-vous que chartData et chartData[0] ne sont pas undefined
      if (this.chartData && this.chartData[0] && this.chartData[0].data) {
        // Utilisez le type correct pour selectedCountryData
        const selectedCountryData = this.chartData[0].data[clickedIndex];

        // Vérifiez si selectedCountryData est défini
        if (selectedCountryData !== null && selectedCountryData !== undefined) {
          // Si c'est un tableau de nombres, utilisez directement la valeur
          const selectedCountryId = (Array.isArray(selectedCountryData)) ? (selectedCountryData[0] as number) + 1 : (selectedCountryData as number) + 1;

          // Navigue vers la page de détail en utilisant le Router
          this.router.navigate(['/detail', selectedCountryId]);
        }
      }
    }
  }

}
//Fin class
