import { ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  UntypedFormBuilder,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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

interface SignUpForm {
  email: FormControl<string>;
  password: FormControl<string>;
  passwordRepeat: FormControl<string>;
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent {
  isLoading = false;
  signUpForm: FormGroup<SignUpForm>;
  passwordMinLength = 7;

  matcher = new MyErrorStateMatcher();

  constructor(
    @Optional() private readonly auth: Auth,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly router: Router,
    private readonly _snackbar: MatSnackBar
  ) {
    this.signUpForm = this.formBuilder.nonNullable.group(
      {
        email: new FormControl<string>('', {
          nonNullable: true
        }),
        password: new FormControl<string>('', {
          nonNullable: true
        }),
        passwordRepeat: new FormControl<string>('', {
          nonNullable: true
        })
      },
      {
        validators: [this.getPasswordValidator()]
      }
    );
  }

  password(formGroup: FormGroup<SignUpForm>): boolean {
    return (
      formGroup.controls.password.value ==
      formGroup.controls.passwordRepeat.value
    );
  }

  signUp(): void {
    this.isLoading = true;
    createUserWithEmailAndPassword(
      this.auth,
      this.signUpForm.controls.email.value,
      this.signUpForm.controls.password.value
    )
      .then((res) => {
        this._snackbar.open('sign up complete', 'close');
        this.router.navigateByUrl('/');
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
