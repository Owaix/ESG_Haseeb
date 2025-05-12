import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements AfterViewInit {
  headerClass: string = '';
  footerClass: string = '';

  constructor(private router: Router) {
  }
  ngOnInit() {
    this.router.events.subscribe(() => {
      this.headerClass = this.router.url === '/' || this.router.url.includes('#') ? 'home' : 'other';
      this.footerClass = this.router.url === '/' || this.router.url.includes('#') ? 'home1' : 'other1';
    });
  }

  ngAfterViewInit(): void {
    const footer = document.getElementsByTagName('footer')[0];

    if (footer) {
      document.addEventListener('scroll', () => {
        this.animation(footer);
      })
    }
  }

  private animation(element: HTMLElement) {
    if (this.isInViewport(element)) {
      element.style.opacity = '1';
    }
  }

  private isInViewport(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      Math.round(rect.bottom) <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }
}
