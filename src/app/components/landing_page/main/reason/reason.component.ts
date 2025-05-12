import { Component, Input, ViewChild, ElementRef } from "@angular/core";

@Component({
  selector: 'reason-item',
  templateUrl: './reason.component.html',
  styleUrls: ['./reason.component.sass']
})
export class ReasonItem {
  @ViewChild('reasonItem') reasonItem?: ElementRef<HTMLDivElement>;

  @Input('reasonImageUrl') reasonImageUrl?: string;

  @Input('reasonTitle') reasonTitle?: string;

  @Input('reasonContent') reasonContent?: string;

  ngAfterViewInit(): void {
    if (this.reasonItem) {
      this.animation(this.reasonItem.nativeElement);
    }
  }

  private animation(element: HTMLElement) {
    document.addEventListener('scroll', () => {
      if (this.isInViewport(element)) {
        element.style.opacity = '1';
      }
    })
  }

  private isInViewport(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}
