import { Component, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ChartDataSets, ChartType, ChartPoint } from 'chart.js';
import { Color } from 'ng2-charts';
import { Country } from 'src/app/pages/models/Country';
import { Participation } from 'src/app/pages/models/Participation';
import { CustomChartPoint } from '../models/CustomChartPoint';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {
  /**
   * Déclaration de la table de correspondance des noms de pays vers les identifiants (statique)
   */
  private static readonly countryIdMap: { [key: string]: number } = {
    'Italy': 1,
    'Spain': 2,
    'United States': 3,
    'Germany': 4,
    'France': 5,
  };

  /**
   * Options du graphique
   */
  public chartOptions = {
    responsive: true,
    onClick: (event: MouseEvent, chartElements: ChartPoint[]) => this.onChartClick(event, chartElements),
  };

  /**
   * Libellés (étiquettes) pour l'axe des x du graphique;
   *
   * Initialisation de chartLabels avec un tableau vide
   */
  public chartLabels: string[] = [];

  /**
   * Type de graphique (Graphique en cercle (pie) ou donut (doughnut))
   */
  public chartType: ChartType = 'pie';

  /**
   * Afficher la légende du graphique
   */
  public chartLegend = true;

  /**
   * Les données du graphique (initialisées avec un tableau vide)
   */
  public chartData: ChartDataSets[] = [{ data: [] as number[], label: 'Nombre de médailles' }];

  /**
   * Couleurs spécifiées pour chaque segment du graphique
   */
  public chartColors: Color[] = [
    {
      backgroundColor: [
        '#9780A1',  // France
        '#956065',  // Italy
        '#BACBE7',  // Spain
        '#89A1DB',  // United States
        '#793D52',  // Germany
      ],
    },
  ];

  /**
   * Méthode qui donne le nombre d'années et le nombre de pays
   */
  public numberOfYears: number | null = null;
  public numberOfCountries: number | null = null;

  /**
   * Injection du service OlympicService dans le constructeur
   * @param olympicService
   * @param router
   */
  constructor(private olympicService: OlympicService, private router: Router) {}

  /**
   * Ajoute une propriété pour stocker l'ID du pays sélectionné
   */
  selectedCountryId: number | null = null;

  /**
   * Méthode ngOnInit qui est appelée lors de l'initialisation du composant
   */
  ngOnInit(): void {
    // Appel à la méthode getOlympics du service OlympicService pour récupérer les données
    this.olympicService.getOlympics().subscribe((data: Country[]) => {
      // Vérification si les données sont un tableau
      if (Array.isArray(data)) {

        // Calcul du nombre total d'années différentes
        const uniqueYears = new Set<number>();
        // Calcul du nombre de pays différents
        const uniqueCountries = new Set<string>();

        // Initialisation d'un tableau pour stocker le total des médailles de chaque pays
        const totalMedalsData: number[] = [];

        // Parcours de la liste des pays
        data.forEach((country) => {

          // Ajout des années aux années uniques
          if (Array.isArray(country.participations)) {
            country.participations.forEach((participation) => {
              uniqueYears.add(participation.year);
            });
          }

          // Ajout des noms de pays aux pays uniques
          uniqueCountries.add(country.country);

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
          this.chartOptions.onClick = (event: MouseEvent, chartElements: ChartPoint[]) =>
            this.onChartClick(event, chartElements);
        });

        // Mise à jour des données du graphique avec les totaux de médailles par pays
        this.chartData[0].data = totalMedalsData;

        // Attribution du nombre total d'années différentes
        this.numberOfYears = uniqueYears.size;

        // Attribution du nombre de pays différents
        this.numberOfCountries = uniqueCountries.size;
      }
    });
  }

  /**
   * Méthode appelée lorsqu'un segment du graphique est cliqué
   * @param event
   * @param chartElements
   */
  onChartClick(event: MouseEvent, chartElements: CustomChartPoint[]): void {
    // Vérifie si des éléments de graph ont été cliqués et s'il y en a au moins un
    if (chartElements && chartElements.length > 0) {
      // Récupère l'index du segment cliqué dans le graph
      const clickedIndex: number | undefined = chartElements[0]._index;

      // Vérifie si les données du graph et les données du segment existent
      if (this.chartData && this.chartData[0] && this.chartData[0].data) {
        // Vérifie si un index a été défini
        if (clickedIndex !== undefined) {
          // Récupère le countryName correspondant à l'index cliqué dans le graph
          const countryName = this.chartLabels[clickedIndex];

          // Récupère l'ID du pays a partir de la table de correspondance statique
          const selectedCountryId = HomeComponent.countryIdMap[countryName];

          // Navigue vers la page de détail du pays sélectionné
          this.router.navigate(['/detail', selectedCountryId]);
        }
      }
    }
  }
}
