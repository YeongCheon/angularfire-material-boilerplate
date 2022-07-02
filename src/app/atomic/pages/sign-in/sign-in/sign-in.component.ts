import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Optional,
  ViewChild
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  FormGroupDirective,
  NgForm,
  FormControl,
  FormGroup
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  Auth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  AuthError,
  AuthErrorCodes
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import {
  browserLocalPersistence,
  FacebookAuthProvider,
  setPersistence,
  TwitterAuthProvider
} from '@firebase/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

interface SignInFormGroup {
  email: FormControl<string>;
  password: FormControl<string>;
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInComponent {
  googleProvider = new GoogleAuthProvider();
  facebookProvider = new FacebookAuthProvider();
  twitterProvider = new TwitterAuthProvider();

  isLoginLoading = false;
  signInForm: FormGroup<SignInFormGroup>;

  matcher = new MyErrorStateMatcher();

  @ViewChild('email')
  emailElement!: ElementRef<HTMLInputElement>;

  constructor(
    @Optional() private auth: Auth,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly router: Router,
    private readonly _snackbar: MatSnackBar,
    private readonly cdRef: ChangeDetectorRef
  ) {
    this.signInForm = this.formBuilder.nonNullable.group({
      email: new FormControl<string>('', {
        nonNullable: true
      }),
      password: new FormControl<string>('', {
        nonNullable: true
      })
    });
  }

  loginEmailAndPassword(): void {
    if (this.signInForm.invalid) {
      return;
    }

    const email = this.signInForm.controls.email.value;
    const password = this.signInForm.controls.password.value;

    setPersistence(this.auth, browserLocalPersistence).then(() => {
      this.isLoginLoading = true;
      signInWithEmailAndPassword(this.auth, email, password)
        .then((res) => {
          this.router.navigate(['/', 'images']);
        })
        .catch((err: AuthError) => {
          switch (err.code) {
            case AuthErrorCodes.USER_DELETED:
            case AuthErrorCodes.INVALID_PASSWORD:
              this._snackbar
                .open('id or password wrong.', 'OK')
                .afterDismissed()
                .pipe(untilDestroyed(this))
                .subscribe(() => {
                  this.emailElement.nativeElement.focus();
                });
              break;
            default:
              this._snackbar.open(err.message, 'close');
              break;
          }
        })
        .finally(() => {
          this.isLoginLoading = false;
          this.cdRef.detectChanges();
        });
    });
  }
}
