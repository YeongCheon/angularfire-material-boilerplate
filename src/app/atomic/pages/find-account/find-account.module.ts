import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { FindAccountRoutingModule } from './find-account-routing.module';
import { FindAccountComponent } from './find-account/find-account.component';

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
export class FindAccountModule {}
