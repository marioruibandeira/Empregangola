import { Component, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';


@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './servicos.component.html',
  styleUrl: './servicos.component.css',
})
export class ServicosComponent {

  private observer?: IntersectionObserver;

  constructor(private hostRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const elementos = this.hostRef.nativeElement.querySelectorAll('.scroll-reveal');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // pequeno atraso escalonado para os cards não aparecerem todos ao mesmo tempo
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, index * 80);

            this.observer?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    elementos.forEach((el) => this.observer?.observe(el));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
