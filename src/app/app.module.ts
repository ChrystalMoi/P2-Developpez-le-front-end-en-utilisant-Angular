import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ChartsModule } from 'ng2-charts';
import { DetailComponent } from './pages/detail/detail.component';
import {AppTitleComponent} from '../app/components/app-title/app-title.component'

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, DetailComponent, AppTitleComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, ChartsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
