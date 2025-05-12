// loader.component.ts
import { Component } from '@angular/core';
import { LoaderService } from 'src/app/service/loader.service';

@Component({
  selector: 'app-loader',
  template: `
    <div class="loader-overlay" *ngIf="isLoading | async">
      <div class="spinner"></div>
    </div>
  `,
  styleUrls: ['./loader.component.scss']

})
export class LoaderComponent {
  isLoading = this.loaderService.loading$;

  constructor(private loaderService: LoaderService) { }
}
