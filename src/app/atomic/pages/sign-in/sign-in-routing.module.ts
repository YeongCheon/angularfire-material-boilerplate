import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SignInComponent,
    data: {
      title: 'Sign In',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignInRoutingModule { }
