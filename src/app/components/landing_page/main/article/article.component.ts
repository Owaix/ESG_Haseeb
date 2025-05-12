import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'article-item',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.sass']
})

export class ArticleItem implements AfterViewInit {
  @ViewChild('article') article?: ElementRef<HTMLElement>

  @Input('articleImg') articleImg?: string;

  @Input('articleAuthor') articleAuthor?: string;

  @Input('articleTitle') articleTitle?: string;

  @Input('articleContent') articleContent?: string;

  ngAfterViewInit(): void {
    if (this.article) {
      this.animation(this.article.nativeElement);
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
