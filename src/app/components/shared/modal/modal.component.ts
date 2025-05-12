import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})

export class ModalComponent {

  @Output() close = new EventEmitter<void>();
  @Input() errortitle: string = '';
  @Input() buttontitle: string = 'OK';
  @Input() redirectUrl: string = '';

  constructor(
    private router: Router
  ) { }

  get imageSrc(): string {
    return this.errortitle.toLowerCase() === 'success'
      ? '../../../../assets/images/success.png'
      : '../../../../assets/images/delete.png'; // Default image for error
  }

  get textColor(): string {
    return this.errortitle.toLowerCase() === 'success' || this.errortitle === 'Pending Email Verification' ? 'green' : 'red';
  }

  closeModal() {
    if (this.redirectUrl == '') {
      this.close.emit();
    } else {
      this.router.navigate([this.redirectUrl]);
    }
  }
}
