import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MedalService {
  private totalMedalsByParticipation: number = 0;

  // Utilisation d'un Subject pour gérer les médailles
  private medalCountSubject = new Subject<number>();

  // Observable pour que les composants puissent s'abonner aux changements de médailles
  medalCount$ = this.medalCountSubject.asObservable();

  // Méthode pour mettre à jour le nombre de médailles
  updateMedalCount(count: number) {
    this.totalMedalsByParticipation += count;
    this.medalCountSubject.next(this.totalMedalsByParticipation);
  }

  // Méthode pour avoir le nombre total de médailles par participation
  getTotalMedalsByParticipation(): number {
    return this.totalMedalsByParticipation;
  }

  constructor() { }
}
