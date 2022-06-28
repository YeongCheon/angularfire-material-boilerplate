import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FindAccountComponent } from './find-account/find-account.component';
import { FindAccountRoutingModule } from './find-account-routing.module';

@NgModule({
  declarations: [FindAccountComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FindAccountRoutingModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
})
export class FindAccountModule { }
