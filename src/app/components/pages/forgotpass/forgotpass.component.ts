import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Subscription, throwError } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { LoaderService } from 'src/app/service/loader.service';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.css']
})

export class ForgotpassComponent {

  isModalOpen = false;
  errortitle = 'ALERT';
  errormsg = '';
  email = '';
  showPassword = false;
  redirectUrl = ''
  private mySubscription: Subscription | null = null;

  constructor(private service: ApiService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router) { }

  onSubmit() {
    if (this.email) {
      this.loaderService.show();
      this.mySubscription = this.service.sendResetmail({ email: this.email }).pipe(
        catchError(err => {
          if (err.status === 400) {
            this.errormsg = err.error.message;
            if (err.error.status == 'ERR_ACC_NOT_VERIFIED') {
              this.errortitle = 'Pending Email Verification';
            }
            console.log(err.error.status);
            this.openModal();
          } else {
            this.errormsg = err.error.message;
            this.openModal();
          }
          this.loaderService.hide();
          return throwError(() => new Error(err));
        })
      ).subscribe(
        response => {
          this.loaderService.hide();
          if (response.status == "SUCCESS") {
            this.redirectUrl = '/'
            this.errortitle = 'Success';
            this.errormsg = response.message;
            this.openModal();
          }
        },
        error => {
          console.log('Error:', error);
        }
      );
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

}
