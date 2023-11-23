import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// Service responsable de la gestion des médailles
export class MedalService {
  // Pour stocker le nombre total de médailles par participation
  private static totalMedalsByParticipation: number = 0;

  // Utilisation d'un Subject pour gérer les observateur des changements de médaille
  private medalCountSubject = new Subject<number>();

  // Observable pour que les composant puissent s'abonner aux changements de medal
  medalCount$ = this.medalCountSubject.asObservable();

  // Méthode pour mettre à jour le nombre de médailles
  updateMedalCount(count: number) {
    // Ajoute le nombre de médailles passer en paramètre au total
    MedalService.totalMedalsByParticipation += count;

    // Notifie les observateurs du changement de nombre de médailles
    this.medalCountSubject.next(MedalService.totalMedalsByParticipation);
  }

  // Méthode pour obtenir le nombre total de médailles par participation
  getTotalMedalsByParticipation(): number {
    return MedalService.totalMedalsByParticipation;
  }

  // Constructeur vide car il n'y a pas d'initialisation spécifique nécessaire ici
  constructor() { }
}
