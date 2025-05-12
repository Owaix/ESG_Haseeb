import { Component } from "@angular/core";

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass' , './main.component.scss']
})
export class Main {
  reasonItems = [
    {
      reasonImageUrl: '../../../assets/images/award.png',
      reasonTitle: 'Online Banking',
      reasonContent: 'Our modern web and mobile applications allow you to keep track of your finances wherever you are in the world.'
    },
    {
      reasonImageUrl: '../../../assets/images/award.png',
      reasonTitle: 'Simple Budgeting',
      reasonContent: 'See exactly where your money goes each month. Receive notifications when you’re close to hitting your limits..'
    },
    {
      reasonImageUrl: '../../../assets/images/icon-onboarding.svg',
      reasonTitle: 'Fast Onboarding',
      reasonContent: 'We don’t do branches. Open your account in minutes online and start taking control of your finances right away.'
    }
  ]

  articleItems = [
    {
      articleImg: '../../../assets/images/image-currency.jpg',
      articleTitle: 'Receive money in any currency with no fees',
      articleContent: 'The world is getting smaller and we’re becoming more mobile. So why should you be forced to only receive money in a single …',
      articleAuthor: 'Claire Robinson'
    },
    {
      articleImg: '../../../assets/images/image-restaurant.jpg',
      articleTitle: 'Treat yourself without worrying about money',
      articleContent: 'Our simple budgeting feature allows you to separate out your spending and set realistic limits each month. That means you …',
      articleAuthor: 'Wilson Hutton'
    },
    {
      articleImg: '../../../assets/images/image-plane.jpg',
      articleTitle: 'Take your imowais card wherever you go',
      articleContent: 'We want you to enjoy your travels. This is why we don’t charge any fees on purchases while you’re abroad. We’ll even show you …',
      articleAuthor: 'Wilson Hutton'
    },
    {
      articleImg: '../../../assets/images/image-confetti.jpg',
      articleTitle: 'Our invite-only Beta accounts are now live!',
      articleContent: 'After a lot of hard work by the whole team, we’re excited to launch our closed beta. It’s easy to request an invite through the site ...',
      articleAuthor: 'Claire Robinson'
    },
  ]
}
