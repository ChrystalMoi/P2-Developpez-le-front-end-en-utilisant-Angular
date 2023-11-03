// Importation des modules et composants nécessaires
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

// Configuration des routes de l'application
const routes: Routes = [
  {
    path: '', // Le chemin vide correspond à la page d'accueil
    component: HomeComponent, // Charge le composant HomeComponent pour la page d'accueil
  },
  {
    path: '**', // Wildcard : correspond à toutes les autres routes non définies
    component: NotFoundComponent, // Charge le composant NotFoundComponent pour les routes inconnues
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Configure le module de routage avec les routes définies
  exports: [RouterModule], // Permet d'utiliser le module de routage ailleurs dans l'application
})
export class AppRoutingModule {}
