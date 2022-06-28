import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FindAccountComponent } from './find-account/find-account.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: FindAccountComponent,
    data: {
      title: 'Find Account',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FindAccountRoutingModule { }
