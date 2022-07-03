import {
  ChangeDetectionStrategy,
  Component,
  Optional,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  Auth,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail
} from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

interface FindAccount {
  email: FormControl<string>;
}

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-find-account',
  templateUrl: './find-account.component.html',
  styleUrls: ['./find-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FindAccountComponent {
  @ViewChild('findPasswordDialogTemplate')
  dialogTemplate!: TemplateRef<unknown>;

  isLoading = false;
  findAccountForm: FormGroup<FindAccount>;

  constructor(
    @Optional()
    private readonly auth: Auth,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly _snackbar: MatSnackBar
  ) {
    this.findAccountForm = this.fb.nonNullable.group({
      email: new FormControl<string>('', {
        nonNullable: true
      })
    });
  }

  findAccount(): void {
    const email = this.findAccountForm.controls.email.value;
    fetchSignInMethodsForEmail(this.auth, email).then((signInMethodList) => {
      if (signInMethodList.find((item) => item == 'password')) {
        this.showFindPasswordDialog(email);
      } else {
        this._snackbar.open('account not found', 'close', {
          duration: 3000
        });
      }
    });
  }

  private showFindPasswordDialog(email: string): void {
    this.dialog
      .open(this.dialogTemplate)
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        if (res) {
          sendPasswordResetEmail(this.auth, email).then((res) => {
            this._snackbar.open('Email sent complete.', 'close');
          });
        }
      });
  }
}
