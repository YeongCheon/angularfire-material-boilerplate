import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Self,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  NgControl,
  Validators
} from '@angular/forms';
import {
  MatFormField,
  MatFormFieldControl,
  MAT_FORM_FIELD
} from '@angular/material/form-field';
import { Subject } from 'rxjs';

/** Data structure for holding telephone number. */
export class Tel {
  public area: string;
  public exchange: string;
  public subscriber: string;

  constructor(area: string, exchange: string, subscriber: string) {
    this.area = area;
    this.exchange = exchange;
    this.subscriber = subscriber;
  }

  toString(): string {
    return this.area + this.exchange + this.subscriber;
  }

  static fromPhoneNumber(phoneNumber: string): Tel {
    const result = new Tel('', '', '');

    if (phoneNumber.length >= 3) {
      result.area = phoneNumber.substring(0, 3);
    }
    if (phoneNumber.length >= 6) {
      result.exchange = phoneNumber.substring(3, 7);
    }
    if (phoneNumber.length >= 9) {
      result.subscriber = phoneNumber.substring(7, 11);
    }

    return result;
  }
}

@Component({
  selector: 'app-phone-number-input',
  templateUrl: './phone-number-input.component.html',
  styleUrls: ['./phone-number-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MatFormFieldControl, useExisting: PhoneNumberInputComponent }
  ]
})
export class PhoneNumberInputComponent
  implements ControlValueAccessor, MatFormFieldControl<Tel>, OnDestroy {
  static nextId = 0;
  @ViewChild('area') areaInput?: HTMLInputElement;
  @ViewChild('exchange') exchangeInput?: HTMLInputElement;
  @ViewChild('subscriber') subscriberInput?: HTMLInputElement;

  parts = this._formBuilder.group({
    area: [
      '',
      [
        Validators.pattern('^[0-9]{3}$'),
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3)
      ]
    ],
    exchange: [
      '',
      [
        Validators.pattern('^[0-9]{4}$'),
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4)
      ]
    ],
    subscriber: [
      '',
      [
        Validators.pattern('^[0-9]{4}$'),
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4)
      ]
    ]
  });
  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  controlType = 'app-tel-input';
  id = `app-tel-input-${PhoneNumberInputComponent.nextId++}`;
  onChange = (_: any): void => { };
  onTouched = (): void => { };

  placeholder010 = '';
  placeholder0000 = '';

  get empty(): boolean {
    const {
      value: { area, exchange, subscriber }
    } = this.parts;

    return !area && !exchange && !subscriber;
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @Input('aria-describedby') userAriaDescribedBy!: string;

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder = '';

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get value(): Tel | null {
    if (this.parts.valid) {
      const {
        value: { area, exchange, subscriber }
      } = this.parts;
      return new Tel(area!, exchange!, subscriber!);
    }
    return null;
  }
  set value(tel: Tel | null) {
    const { area, exchange, subscriber } = tel || new Tel('', '', '');
    this.parts.setValue({ area, exchange, subscriber });
    this.stateChanges.next();
  }

  get errorState(): boolean {
    return this.parts.invalid && this.touched;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    private cdRef: ChangeDetectorRef,
    @Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  onFocusIn(event: FocusEvent): void {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }

    this.placeholder010 = '010';
    this.placeholder0000 = '0000';
  }

  onFocusOut(event: FocusEvent): void {
    if (
      !this._elementRef.nativeElement.contains(event.relatedTarget as Element)
    ) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }

    this.placeholder010 = '';
    this.placeholder0000 = '';
  }

  autoFocusNext(
    control: AbstractControl,
    nextElement?: HTMLInputElement
  ): void {
    if (!control.errors && nextElement) {
      this._focusMonitor.focusVia(nextElement, 'program');
    }
  }

  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length < 1) {
      this._focusMonitor.focusVia(prevElement, 'program');
    }
  }

  setDescribedByIds(ids: string[]): void {
    const controlElement = this._elementRef.nativeElement.querySelector(
      '.app-tel-input-container'
    )!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick(): void {
    if (this.parts.controls.subscriber.valid) {
      this._focusMonitor.focusVia(this.subscriberInput!, 'program');
    } else if (this.parts.controls.exchange.valid) {
      this._focusMonitor.focusVia(this.subscriberInput!, 'program');
    } else if (this.parts.controls.area.valid) {
      this._focusMonitor.focusVia(this.exchangeInput!, 'program');
    } else {
      this._focusMonitor.focusVia(this.areaInput!, 'program');
    }
  }

  writeValue(tel: Tel | null): void {
    this.value = tel;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    this.autoFocusNext(control, nextElement);
    this.onChange(this.value);
  }

  @HostBinding('class.app-floating')
  get isAppFloating(): boolean {
    return this.shouldLabelFloat;
  }

  @HostBinding('id')
  get getId(): string {
    return this.id;
  }
}
