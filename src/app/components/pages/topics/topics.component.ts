import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, interval, Subscription, switchMap, takeWhile, throwError } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { DataService } from 'src/app/service/data.service';
import { EncryptionService } from 'src/app/service/encrypt.service';
import { LoaderService } from 'src/app/service/loader.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})

export class TopicsComponent {
  private mySubscription: Subscription | null = null;
  cards: any[] = [];
  report_id: string = '';
  errormsg = '';
  errortitle = 'Success';
  reports: any[] = [];

  constructor(
    private service: ApiService,
    private dataservice: DataService,
    private loaderService: LoaderService,
    private encrypt: EncryptionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loaderService.show();
    this.mySubscription = this.service.get_topics().subscribe(x => {
      if (x.status == "SUCCESS") {
        this.cards = x.data.topics;
        console.log(this.cards);
        this.report_id = this.encrypt.encrypt(x.data.report_id.toString());
      }
    })
    this.firstLoadHistory();
    this.loadHistory();
  }

  firstLoadHistory() {
    this.mySubscription = this.service.history().subscribe(response => {
      this.reports = response.data;
      this.reports.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      this.loaderService.hide();
    });
  }

  private pollingSubscription!: Subscription;
  private readonly POLLING_INTERVAL = 10000; // 5 seco
  loadHistory(): void {
    this.mySubscription = interval(this.POLLING_INTERVAL)
      .pipe(
        switchMap(() => this.service.history()),
        takeWhile(response => !response.data.every((report: { is_generated: any; }) => report.is_generated), true)
      )
      .subscribe(response => {
        this.reports = response.data;
        this.reports.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        this.loaderService.hide();

        if (this.reports.every(report => report.is_generated)) {
          //this.allGenerated = true;
          console.log('All reports generated. Stopping polling.');
        } else {
          console.log('Waiting for reports to be generated...');
        }
      });
  }

  isModalOpen = false;
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  subtopics(id: number) {
    this.router.navigate(['/subtopics', id, this.report_id]);
  }

  review() {
    this.router.navigate(['/answers', this.report_id]);
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
