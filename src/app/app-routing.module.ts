import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
  AuthPipe
} from '@angular/fire/auth-guard';

const redirectLoggedInToRoot = (): AuthPipe => redirectLoggedInTo(['/', '']);
const redirectUnauthorizedToSignin = (): AuthPipe =>
  redirectUnauthorizedTo(['/signin', '']);

const routes: Routes = [
  {
    path: 'signin',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./atomic/pages/sign-in/sign-in.module').then(
        (m) => m.SignInModule
      ),
    data: {
      authGuardPipe: redirectLoggedInToRoot
    }
  },
  {
    path: 'signup',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./atomic/pages/sign-up/sign-up.module').then(
        (m) => m.SignUpModule
      ),
    data: {
      authGuardPipe: redirectLoggedInToRoot
    }
  },
  {
    path: 'findacount',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./atomic/pages/find-account/find-account.module').then(
        (m) => m.FindAccountModule
      ),
    data: {
      authGuardPipe: redirectLoggedInToRoot
    }
  },
  {
    path: 'account',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./atomic/pages/account/account.module').then(
        (m) => m.AccountModule
      ),
    data: {
      authGuardPipe: redirectUnauthorizedToSignin
    }
  },
  {
    path: '__',
    children: [
      {
        path: 'auth/action',
        loadChildren: () =>
          import('./atomic/pages/reset-password/reset-password.module').then(
            (m) => m.ResetPasswordModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
