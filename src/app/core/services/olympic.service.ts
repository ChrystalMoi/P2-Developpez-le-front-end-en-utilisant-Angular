import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json'; // URL du fichier JSON avec les données olympiques
  private olympics$ = new BehaviorSubject<any>(undefined); // Un conteneur pour stocker les données olympiques

  constructor(private http: HttpClient) {}

  // Charge les données initiales à partir du fichier JSON
  loadInitialData() {
    return this.http.get<any>(this.olympicUrl).pipe(
      // Met à jour les données quand elles sont chargées
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // Gérer les erreurs, affiche les erreurs dans la console
        console.error(error);
        // Indique aux autres parties de l'application qu'une erreur s'est produite
        this.olympics$.next(null);
        // Permet de traiter l'erreur ailleurs si nécessaire
        return caught;
      })
    );
  }

  // Permet d'obtenir les données olympiques sous forme d'observable
  getOlympics() {
    return this.olympics$.asObservable();
  }
}
