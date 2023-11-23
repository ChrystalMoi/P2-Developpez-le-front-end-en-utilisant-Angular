import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MedalService {
  private static totalMedalsByParticipation: number = 0;

  // Utilisation d'un Subject pour gérer les médailles
  private medalCountSubject = new Subject<number>();

  // Observable pour que les composants puissent s'abonner aux changements de médailles
  medalCount$ = this.medalCountSubject.asObservable();

  // Méthode pour mettre à jour le nombre de médailles
  updateMedalCount(count: number) {
    MedalService.totalMedalsByParticipation += count;
    this.medalCountSubject.next(MedalService.totalMedalsByParticipation);
  }

  // Méthode pour obtenir le nombre total de médailles par participation
  getTotalMedalsByParticipation(): number {
    return MedalService.totalMedalsByParticipation;
  }


  constructor() { }
}
