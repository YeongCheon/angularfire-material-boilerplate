import { Component, OnInit, Optional } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Auth, confirmPasswordReset } from '@angular/fire/auth';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  UntypedFormBuilder,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(
      control?.parent?.invalid && control?.parent?.dirty
    );

    return invalidCtrl || invalidParent;
  }
}

interface ResetPasswordForm {
  password: FormControl<string>;
  passwordRepeat: FormControl<string>;
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  isLoading = false;
  resetPasswordForm: FormGroup<ResetPasswordForm>;
  passwordMinLength = 7;

  matcher = new MyErrorStateMatcher();

  code?: string;

  constructor(
    @Optional() private readonly auth: Auth,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly _snackbar: MatSnackBar
  ) {
    this.resetPasswordForm = this.formBuilder.nonNullable.group(
      {
        password: new FormControl<string>('', {
          nonNullable: true,
        }),
        passwordRepeat: new FormControl<string>('', {
          nonNullable: true,
        }),
      },
      {
        validators: [this.getPasswordValidator()],
      }
    );
  }

  ngOnInit(): void {
    this.code = this.route.snapshot.queryParams['oobCode'];
  }

  resetPassword(): void {
    const password = this.resetPasswordForm.controls.password.value;
    if (!this.code) {
      this._snackbar.open('invalid code', 'close', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    confirmPasswordReset(this.auth, this.code, password)
      .then(() => {
        this._snackbar.open('reset password complete', 'close', {
          duration: 3000,
        });

        this.router.navigateByUrl('/signin');
      })
      .catch((err: FirebaseError) => {
        this._snackbar.open(err.message, 'close', { duration: 3000 });
        console.error(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  private getPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')!.value;
      const passwordRepeat = control.get('passwordRepeat')!.value;
      const isValid = password == passwordRepeat;
      return isValid ? null : { passwordStrength: true };
    };
  }
}
