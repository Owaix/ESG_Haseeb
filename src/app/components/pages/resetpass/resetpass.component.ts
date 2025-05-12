import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Subscription, throwError } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { LoaderService } from 'src/app/service/loader.service';

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.css']
})

export class ResetpassComponent {
  private mySubscription: Subscription | null = null;
  password = '';
  confirm_password = '';
  errortitle = 'ALERT';
  errormsg = '';
  showPassword = false;
  redirectUrl = '';
  showCnfrmPassword = false;

  constructor(private route: ActivatedRoute,
    private service: ApiService,
    private loaderService: LoaderService,
    private router: Router) { }

  onSubmit(): void {
    this.loaderService.show();
    this.route.queryParams.subscribe(params => {
      let token = params['token'];
      let obj = {
        token: token,
        new_password: this.password
      }

      this.mySubscription = this.service.resetpass(obj).pipe(
        catchError(err => {
          this.loaderService.hide();
          this.redirectUrl = ''
          this.errortitle = 'ALERT';
          this.errormsg = err.error.message;
          this.openModal();
          return throwError(() => new Error("err"));
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
    });
  }

  get passwordMismatch() {
    return this.password !== this.confirm_password;
  }

  isModalOpen = false;
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

}
