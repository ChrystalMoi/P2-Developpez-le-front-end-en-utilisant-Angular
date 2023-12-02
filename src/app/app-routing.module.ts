import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetailComponent } from './pages/detail/detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
//import { AppComponent } from './app.component';
//import { AppTitleComponent } from './components/app-title/app-title.component';

const routes: Routes = [
  { path: '', component: HomeComponent,},
  //{ path: 'home', component: HomeComponent,},
  { path: 'detail/:id', component: DetailComponent,},
  { path: '**', component: NotFoundComponent,},
];

@NgModule({
  //declarations: [HomeComponent, NotFoundComponent, DetailComponent, AppTitleComponent],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
