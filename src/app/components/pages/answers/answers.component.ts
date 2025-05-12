import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Subscription, throwError } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { EncryptionService } from 'src/app/service/encrypt.service';
import { LoaderService } from 'src/app/service/loader.service';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.scss']
})

export class AnswersComponent {

  topicData: any = null;
  errorMessage: string = '';
  errortitle = "";
  report_id: string = '0';
  private mySubscription: Subscription | null = null;
  selectedIndex: number = 1;
  tabs: Tabs[] = [];
  private tabsCount = 0;
  errormsg = '';
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };
  redirectUrl: string = '';
  buttontitle = '';

  constructor(private service: ApiService,
    private loaderService: LoaderService,
    protected encrypt: EncryptionService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private elRef: ElementRef
    // private menuService: MenuService,
  ) {
  }

  selectChange(): void {
    console.log("Selected INDEX: " + this.Tab(this.selectedIndex));
    this.getsubtopics(this.Tab(this.selectedIndex));
  }

  ngOnInit(): void {
    this.loaderService.show();
    this.route.params.subscribe(params => {
      this.report_id = this.encrypt.decrypt(params['report_id']);

      this.mySubscription = this.service.get_topics().subscribe(x => {
        if (x.status == "SUCCESS") {
          this.tabsCount = x.data.topics.length;
          for (let i = 0; i < this.tabsCount; i++) {
            let topic = x.data.topics[i];
            this.tabs.push({
              id: topic.id,
              title: topic.name,
              value: topic.name.toLowerCase().replace(/ /g, '-')
            })
          }
          this.getsubtopics(this.Tab(0));
          console.log(this.tabs);
        }
      });
    });

    const container: HTMLElement = this.elRef.nativeElement.querySelector(
      '.terms-container'
    );

    // this.menuService.menuState$.subscribe((isMenuOpen) => {
    //   if (isMenuOpen) {
    //     container.classList.add('menuPosition');
    //   } else {
    //     container.classList.remove('menuPosition');
    //   }
    // });

  }

  swipe(selectedIndex: number, action = this.SWIPE_ACTION.RIGHT) {
    console.log("swipe");
    console.log("number", selectedIndex);
    console.log("action", action);
    // Out of range
    if (this.selectedIndex < 0/* starter point as 1 */ || this.selectedIndex > this.tabsCount/* here it is */) return;

    // Swipe left, next tab
    if (action === this.SWIPE_ACTION.LEFT) {
      const isLast = this.selectedIndex === this.tabsCount;
      this.selectedIndex = isLast ? 0 : this.selectedIndex + 1;
      console.log("Swipe right - INDEX: " + this.selectedIndex);
    }

    // Swipe right, previous tab
    if (action === this.SWIPE_ACTION.RIGHT) {
      const isFirst = this.selectedIndex === 0 /* starter point as 1 */;
      this.selectedIndex = isFirst ? 1 : this.selectedIndex - 1;
      console.log("Swipe left - INDEX: " + this.selectedIndex);
    }
  }

  ngAfterViewInit(): void {
    const elements = this.elRef.nativeElement.querySelectorAll('.mat-ripple.mat-mdc-tab-header-pagination');
    elements.forEach((element: HTMLElement) => {
      this.renderer.setStyle(element, 'display', 'none');
    });
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  Tab(index: number): string {
    if (this.tabs[index]) {
      return this.tabs[index].id.toString();
    }
    return '0';
  }

  getsubtopics(id: string) {
    this.mySubscription = this.service.topic_answer(this.report_id, id).subscribe(
      response => {
        if (response.status == "SUCCESS") {
          this.topicData = [];
          this.topicData = response.data;
          console.log(this.topicData);
        }
        this.loaderService.hide();
      },
      error => {
        this.topicData = [];
        console.log(error)
      }
    );
  }

  generate_report() {
    let obj = { report_id: this.report_id }

    this.mySubscription = this.service.submit_report(obj).pipe(
      catchError(err => {
        if (err.status === 400) {
          this.errormsg = err.error.message;
          this.openModal();
        } else {
          this.errormsg = err.error.message;
          this.openModal();
        }
        this.errortitle = "ALERT";
        return throwError(() => new Error(err));
      })
    ).subscribe(
      response => {
        if (response.status == "SUCCESS") {
          this.errortitle = "Success";
          this.buttontitle = 'My Account';
          this.errormsg = 'We are generating your ESG report. Please go the Report History section under your account to read and download your report.';
          this.redirectUrl = '/topics';
          this.openModal();
        }
      },
      error => {
        console.log('Error:', error);
      }
    );
  }

  sortQuestions(questions: any[]) : any[] {
    return questions = questions.sort((a, b) => a.id - b.id);
  }

  edit(id: number) {
    this.router.navigate(['/subtopics', id, this.encrypt.encrypt(this.report_id)]);
  }

  isModalOpen = false;
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openQuesion(id: number) {
    // this.mySubscription = this.service.get_subtopics(id).subscribe(x => {
    //   if (x.status == "SUCCESS") {
    //     console.log(x.data);
    // this.cards = x.data.subtopics;
    // this.description = x.data.description;
    // this.name = x.data.name;
    // this.note = x.data.note;
    //   }
    // })
  }

  showQues(id: number[], name: string) {
    // if (id.length > 0) {
    // this.dataService.changeData({
    //   topic_id: this.topic_id,
    //   report_id: this.report_id,
    //   title: name,
    //   questionList: id.join(',')
    // })
    //   this.router.navigate(['/question']);
    // }
  }

}

export interface Tabs {
  id: number;
  title: string;
  value: string;
}