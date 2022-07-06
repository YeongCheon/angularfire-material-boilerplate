import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, RouterModule, MatButtonModule, HomeRoutingModule],
  exports: [HomeComponent]
})
export class HomeModule { }
