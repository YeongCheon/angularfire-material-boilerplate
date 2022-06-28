import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AuthGuard,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';

const redirectLoggedInToRoot = () => redirectLoggedInTo(['/', '']);

const routes: Routes = [
  {
    path: 'signin',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./atomic/pages/sign-in/sign-in.module').then(
        (m) => m.SignInModule
      ),
    data: {
      authGuardPipe: redirectLoggedInToRoot,
    },
  },
  {
    path: 'signup',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./atomic/pages/sign-up/sign-up.module').then(
        (m) => m.SignUpModule
      ),
    data: {
      authGuardPipe: redirectLoggedInToRoot,
    },
  },
  {
    path: 'findacount',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./atomic/pages/find-account/find-account.module').then(
        (m) => m.FindAccountModule
      ),
    data: {
      authGuardPipe: redirectLoggedInToRoot,
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
