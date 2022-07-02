import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneNumberInputComponent } from './phone-number-input/phone-number-input.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PhoneNumberInputComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [PhoneNumberInputComponent]
})
export class PhoneNumberInputModule { }
