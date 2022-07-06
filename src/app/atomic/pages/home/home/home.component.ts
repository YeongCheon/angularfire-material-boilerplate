import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Optional
} from '@angular/core';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  user: User | null = null;
  constructor(
    @Optional()
    private readonly auth: Auth,
    private readonly cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (res) => {
      this.user = res;
      this.cdRef.detectChanges();
    });
  }

  signout(): void {
    signOut(this.auth).then(() => {
      this.user = null;
      this.cdRef.detectChanges();
    });
  }
}
