import { Component, OnDestroy, AfterViewInit } from "@angular/core";

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class Footer implements AfterViewInit, OnDestroy {
  nav = ['FAQ', 'Terms And Condition', 'Privacy Policy', 'Cancellation & Refund Policy', 'TRY ESG Report'];

  nav2 = [];

  ngAfterViewInit(): void {
    // const svgs = document.getElementsByClassName('icons-social')[0].getElementsByTagName('svg');

    // for (let i = 0; i < svgs.length; i++) {
    //   svgs[i].addEventListener('mouseover', () => {
    //     svgs[i].getElementsByTagName('path')[0].setAttribute('fill', 'var(--lime-green)');
    //   });

    //   svgs[i].addEventListener('mouseout', () => {
    //     svgs[i].getElementsByTagName('path')[0].setAttribute('fill', '#FFF');
    //   });
    // }
  }

  ngOnDestroy(): void {
    const svgs = document.getElementsByClassName('icons-social')[0].getElementsByTagName('svg');

    for (let i = 0; i < svgs.length; i++) {
      svgs[i].removeEventListener('mouseover', () => {});

      svgs[i].removeEventListener('mouseout', () => {});
    }
  }
}
