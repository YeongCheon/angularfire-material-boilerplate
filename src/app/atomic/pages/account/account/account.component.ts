import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Optional,
} from '@angular/core';
import { getApp } from '@angular/fire/app';
import { Auth, updateProfile } from '@angular/fire/auth';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  percentage,
  ref,
  StorageError,
  uploadBytesResumable,
} from '@angular/fire/storage';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { ChangePasswordComponent } from 'src/app/atomic/templates/change-password/change-password/change-password.component';
import { environment } from 'src/environments/environment';

interface Account {
  displayName: FormControl<string | null>;
  photoURL: FormControl<string | null>;
  // phoneNumber: FormControl<Tel | null>;
  // email: FormControl<string>;
}

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent implements OnInit {
  isLoading = false;
  isUploadingPhoto = false;
  accountForm: FormGroup<Account>;
  photoUploadPercent: Subject<number | undefined> = new Subject();

  constructor(
    @Optional() private readonly auth: Auth,
    private readonly fb: FormBuilder,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router,
    private readonly cdRef: ChangeDetectorRef,
    private readonly dialog: MatDialog
  ) {
    this.accountForm = this.fb.group({
      displayName: new FormControl<string | null>('', {
        validators: [Validators.required],
      }),
      photoURL: new FormControl<string | null>('', {}),
      // phoneNumber: new FormControl<Tel | null>(new Tel('', '', ''))
    });
  }

  ngOnInit(): void {
    const currentUser = this.auth.currentUser;

    if (!currentUser) {
      this.snackbar.open('login please.', 'close');
      this.router.navigateByUrl('/signin');
      return;
    }

    this.accountForm.controls.displayName.setValue(currentUser.displayName);
    this.accountForm.controls.photoURL.setValue(currentUser.photoURL);
  }

  onChangeInputFile(event: any): void {
    const fileList: FileList = event.target.files;
    this.upload(fileList);
  }

  upload(fileList: FileList): void {
    const file = fileList[0];

    const currentUser = this.auth.currentUser;

    const filePath = `u/${currentUser?.uid}/images/${new Date().getTime()}_${
      file.name
    }`;

    this.isUploadingPhoto = true;

    this.cdRef.detectChanges();

    const fileRef = ref(
      getStorage(getApp(), environment.firebase.storageBucket),
      filePath
    );
    const task = uploadBytesResumable(fileRef, file);

    this.isUploadingPhoto = true;
    percentage(task)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (inProgress) => {
          this.photoUploadPercent.next(inProgress.progress);
          this.cdRef.detectChanges();
        },
        error: (err: StorageError) => {
          console.error(err);
          this.photoUploadPercent.error(err);

          this.snackbar.open(err.code, 'OK');
          this.isUploadingPhoto = false;
          this.accountForm.controls.photoURL.setValue(null);
          this.cdRef.detectChanges();
        },
        complete: async () => {
          this.isUploadingPhoto = false;
          const url = await getDownloadURL(fileRef);
          this.accountForm.controls.photoURL.setValue(url);

          this.cdRef.detectChanges();
          this.photoUploadPercent.complete();
        },
      });
  }

  clearImage(url: string): void {
    if (this.auth.currentUser?.photoURL === url) {
      this.accountForm.controls.photoURL.setValue(null);
      return;
    }

    this.deleteImage(url);
  }

  deleteImage(url: string, isClearFormFiled = true): void {
    const fileRef = ref(
      getStorage(getApp(), environment.firebase.storageBucket),
      url
    );

    deleteObject(fileRef).then(() => {
      if (isClearFormFiled) {
        this.accountForm.controls.photoURL.setValue(null);
      }

      this.cdRef.detectChanges();
    });
  }

  updateProfile(): void {
    const displayName = this.accountForm.controls.displayName.value;
    const photoURL = this.accountForm.controls.photoURL.value;

    const oldPhotoUrl = this.auth.currentUser!.photoURL;

    const isChangedPhoto = !!oldPhotoUrl && oldPhotoUrl !== photoURL;
    if (isChangedPhoto) {
      this.deleteImage(oldPhotoUrl, false);
    }

    updateProfile(this.auth.currentUser!, {
      displayName: displayName ?? '',
      photoURL: photoURL ?? '',
    }).then(() => {
      this.snackbar.open('update complete', 'close', { duration: 3000 });
    });
  }

  showChangePasswordDialog(): void {
    this.dialog.open(ChangePasswordComponent, {
      width: '300px',
    });
  }
}
