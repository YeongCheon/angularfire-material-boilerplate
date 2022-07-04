import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Optional
} from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  Auth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from '@angular/fire/auth';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MyErrorStateMatcher } from 'src/app/util/password-error-state-matcher';

interface ChangePasswordForm {
  currentPassword: FormControl<string>;
  newPassword: FormControl<string>;
  newPasswordRepeat: FormControl<string>;
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent {
  isLoading = false;

  changePasswordForm: FormGroup<ChangePasswordForm>;
  passwordMinLength = 7;

  matcher = new MyErrorStateMatcher();

  constructor(
    @Optional()
    private auth: Auth,
    private snackbar: MatSnackBar,
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<ChangePasswordComponent>,
    private readonly cdRef: ChangeDetectorRef
  ) {
    this.changePasswordForm = this.fb.nonNullable.group(
      {
        currentPassword: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required]
        }),
        newPassword: new FormControl('', {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.minLength(this.passwordMinLength)
          ]
        }),
        newPasswordRepeat: new FormControl('', {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.minLength(this.passwordMinLength)
          ]
        })
      },
      {
        validators: [this.getPasswordValidator()]
      }
    );
  }

  changePassword(): void {
    this.isLoading = true;

    const email = this.auth.currentUser!.email!;
    const currentPassword = this.changePasswordForm.controls.currentPassword
      .value;
    const newPassword = this.changePasswordForm.controls.newPassword.value;

    const credential = EmailAuthProvider.credential(email, currentPassword);
    reauthenticateWithCredential(this.auth.currentUser!, credential)
      .then(() => {
        return updatePassword(this.auth.currentUser!, newPassword);
      })
      .then(() => {
        this.snackbar.open('password update complete', 'close', {
          duration: 3000
        });

        this.dialogRef.close();
      })
      .catch((err: FirebaseError) => {
        this.snackbar.open(err.message, 'close', { duration: 3000 });
      })
      .finally(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      });
  }

  private getPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('newPassword')!.value;
      const passwordRepeat = control.get('newPasswordRepeat')!.value;
      const isValid = password == passwordRepeat;
      return isValid ? null : { passwordStrength: true };
    };
  }
}
