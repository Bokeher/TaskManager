import { Directive, HostListener, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: 'textarea[appAutoResize]'
})
export class AutoResizeDirective implements AfterViewInit {
  constructor(private element: ElementRef) {}

  @HostListener('input')
  onInput(): void {
    this.resize();
  }

  ngAfterViewInit(): void {
    this.resize();
  }

  private resize(): void {
    const textarea = this.element.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
