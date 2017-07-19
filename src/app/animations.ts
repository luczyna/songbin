import { trigger, state, style,
         animate, transition } from '@angular/animations';

export function getSlideAnimations() {
  // https://angular.io/guide/animations#example-entering-and-leaving
  return trigger('sliding', [
    state('in', style({transform: 'translateX(0)'})),
    transition(':enter', [
      style({transform: 'translateX(-100%)'}),
      animate(150)
    ]),
    transition(':leave', [
      animate(150, style({transform: 'translateX(100%)'}))
    ])
  ])
}
