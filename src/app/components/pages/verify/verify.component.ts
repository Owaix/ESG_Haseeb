import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Subscription, throwError } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})

export class VerifyComponent implements OnInit {

  checkIconClass = 'fas fa-check-circle';
  emailVerifiedMessage = 'Email Verified Successfully';
  thankYouMessage = 'Thank you for verifying your email address!';
  accountReadyMessage = 'Your account is now ready to use.';
  nextStepsTitle = 'Next Steps';
  nextSteps = [
    'Log in to your account to explore features.',
    'Check your email for any updates from us.',
    'Contact support if you encounter issues.'
  ];
  loginText = 'LOG IN';
  loginLink = 'login'; // Link path
  linkColor = 'white';

  errorIconClass = 'fas fa-exclamation-circle';
  tokenExpiredMessage = 'Your access token has  expired!';
  tokenExpiredInstructions = 'Your verification token has expired. Please click below to send a new verification email.';
  resendEmailText = 'RESEND EMAIL';

  token: string | null = null;
  isExpire = false;
  private mySubscription: Subscription | null = null;  // Initialized as null

  constructor(private route: ActivatedRoute, private service: ApiService, private router: Router) { }
  updateForExpiredToken(): void {
    this.checkIconClass = this.errorIconClass;
    this.emailVerifiedMessage = this.tokenExpiredMessage;
    this.thankYouMessage = this.tokenExpiredInstructions;
    this.accountReadyMessage = '';
    this.nextStepsTitle = '';
    this.nextSteps = [];
    this.loginText = this.resendEmailText;
    this.loginLink = 'send-new-email';
  }
  resendEmail(): void {
    let obj = {
      type: "token",
      data: this.token
    }

    this.mySubscription = this.service.re_verify(obj).pipe(
      catchError(err => {
        if (err.status === 400) {
          this.updateForExpiredToken();
        } else {
          console.log(err);
        }
        return throwError(() => new Error("err"));
      })
    ).subscribe(
      response => {
        if (response.status == "SUCCESS") {
          this.router.navigate(['/everif']);
          console.log(response)
        }
      },
      error => {
        console.log('Error:', error);
      }
    );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      let obj = {
        verification_token: this.token
      }

      this.mySubscription = this.service.verify(obj).pipe(
        catchError(err => {
          if (err.status === 400) {
            this.updateForExpiredToken();
          } else {
            console.log(err);
          }
          return throwError(() => new Error("err"));
        })
      ).subscribe(
        response => {
          if (response.status == "SUCCESS") {
            console.log(response);
          }
        },
        error => {
          console.log('Error:', error);
        }
      );
    });
  }
  openModal() {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

}