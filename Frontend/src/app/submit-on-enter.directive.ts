import { Directive, HostListener, Optional, Host } from '@angular/core';
import { NgForm } from '@angular/forms';

@Directive({
  selector: '[submitOnEnter]'
})
export class SubmitOnEnterDirective {

  constructor(@Host() @Optional() private form: NgForm) { }

  @HostListener('keydown.enter', ['$event'])
  onEnterKeyPress(event: KeyboardEvent) {
    event.preventDefault();
    
    if (this.form) this.form.ngSubmit.emit();
  }
}
