import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './app-title.component.html',
  styleUrls: ['./app-title.component.css']
})
export class AppTitleComponent {
  //Input : permet de passer une donnée parent vers un composant enfant
  //Output : permet de passer une donnée de l'enfant vers le parent
  @Input() pageTitle: string | undefined;
}
