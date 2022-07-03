import {
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';

@Directive({
  selector: '[appFileDragDrop]'
})
export class FileDragDropDirective {
  @Output()
  appFileDragDrop = new EventEmitter<any>();
  @Input() public draggable = true;

  @HostBinding('hintLine') public deco = false;
  // @HostBinding('style.background-color') public background = '#fff';
  @HostBinding('style.opacity') public opacity = '1';

  constructor(private cdRef: ChangeDetectorRef) { }

  //Dragover 시 스타일 정의
  @HostListener('dragover', ['$event'])
  onDragOver(e: Event): void {
    e.preventDefault();
    e.stopPropagation();

    if (!this.draggable) return;

    // this.background = '#ECF8FF';
    this.opacity = '0.5';
    this.cdRef.detectChanges();
  }

  //Dragleave 시 스타일 정의
  @HostListener('dragleave', ['$event'])
  public onDragLeave(e: Event): void {
    e.preventDefault();
    e.stopPropagation();

    // this.background = '#fff';
    this.opacity = '1';
    this.cdRef.detectChanges();
  }

  //Drop 시 받은 파일 목록을, 이 디렉티브를 사용하는 컴포넌트에 쏘아줍니다
  @HostListener('drop', ['$event'])
  public ondrop(e: InputEvent): void {
    e.preventDefault();
    e.stopPropagation();

    // this.background = '#fff';
    this.opacity = '1';

    if (!this.draggable) return;

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      this.appFileDragDrop.emit(files);
    }
  }
}
