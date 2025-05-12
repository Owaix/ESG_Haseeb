import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/service/loader.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})

export class EmailVerificationComponent implements OnInit {
  constructor(private loaderService: LoaderService) {
    this.loaderService.hide();
  }
  ngOnInit(): void {
  }

}
