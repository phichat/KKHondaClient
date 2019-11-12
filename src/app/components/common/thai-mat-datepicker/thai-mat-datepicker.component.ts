import { Component, Input, HostBinding, Injector, DoCheck, ElementRef, Optional, Self } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ControlValueAccessor, NgControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'thai-mat-datepicker',
  templateUrl: 'thai-mat-datepicker.component.html',
  styleUrls: ['thai-mat-datepicker.component.scss']
})

export class ThaiMatDatepickerComponent implements ControlValueAccessor, DoCheck {

  static nextId = 0;
  @HostBinding() id = `thai-mat-datepicker-${ThaiMatDatepickerComponent.nextId++}`;

  dpicker: FormGroup;

  stateChanges = new Subject<void>();
  focused = false;
  errorState = false;
  controlType = 'thai-mat-datepicker';
  describedBy = '';
  onChange = (_: any) => { };
  onTouched = () => { };

  @Input()
  get value(): Date | null {
    return this._value;
  }
  set value(value: Date | null) {
    this._value = value;
    this.onChange(value);
    this.onTouched();
    this.stateChanges.next();
  }
  private _value: Date;

  @Input()
  get placeholder(): string { return this._placeholder; }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string = '';

  @Input()
  get required(): boolean { return this._required; }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _disabled = false;


  constructor(
    public elRef: ElementRef<HTMLElement>,
    public injector: Injector,
    private fm: FocusMonitor,
    @Optional() @Self() public ngControl: NgControl
  ) {
    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      if (this.focused && !origin) {
        this.onTouched();
      }
      this.focused = !!origin;
      this.stateChanges.next();
    });

    this.ngControl = this.injector.get(NgControl);
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
  }

  ngDoCheck(): void {
    if (this.ngControl) {
      this.errorState = this.ngControl.invalid && this.ngControl.touched;
      this.stateChanges.next();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  writeValue(val: any): void {
    if (val) this.value = val;
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

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.value = event.value;
  }

  clear() {
    this.value = null;
  }
}
