import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Subscription, throwError } from 'rxjs';
import { Category, CategorySector, CategoryType, User } from 'src/app/models/User';
import { ApiService } from 'src/app/service/api.service';
import { LoaderService } from 'src/app/service/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  users: User = new User;
  private mySubscription: Subscription | null = null;  // Initialized as null
  typeList: CategoryType[] = [];
  sectorList: CategorySector[] = [];
  errormsg = '';
  showPassword = false;
  showCnfrmPassword = false;
  errortitle = 'ALERT';
  categories: Category[] = []
  redirectUrl = '';

  constructor(
    private service: ApiService,
    private router: Router,
    private loaderService: LoaderService
  ) { }
  ngOnInit(): void {
    this.mySubscription = this.service.Getcategories().subscribe(x => {
      if (x.status == "SUCCESS") {
        this.categories = x.data;
        console.log(this.categories);
      }
    })
  }

  onSubmit() {
    if (this.users.email && this.users.password) {
      this.loaderService.show();
      this.mySubscription = this.service.register(this.users).pipe(
        catchError(err => {
          if (err.status === 400) {
            this.errormsg = err.error.message;
            if (err.error.status == 'ERR_ACC_NOT_VERIFIED') {
              this.errortitle = 'Pending Email Verification';
            }
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
          if (response.status == "SUCCESS") {
            this.errortitle = 'Success';
            this.errormsg = `Thank you for signing up with ESG AI Reporting! Your account has been successfully created, but we need one quick step to ensure it's really you.<br/>
                             <br/>📧  An email verification link has been sent to your inbox.
                             <br/>Please check your email (including spam/junk folders) and click the verification link to activate your account.`;
            this.redirectUrl = '/login';
            this.openModal();
            this.loaderService.hide();

          }
        },
        error => {
          console.log('Error:', error);
        }
      );
    }

  }
  oncategoryChange(event: any): void {
    const id = event.target.value;
    let cate = this.categories.find(y => y.id == id);
    console.log(cate?.types);
    this.typeList = cate!.types;
    this.sectorList = cate!.sectors;
  }
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  isModalOpen = false;
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  get passwordMismatch() {
    return this.users.password !== this.users.confirm_password;
  }
}
