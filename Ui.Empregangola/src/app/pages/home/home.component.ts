import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent implements OnInit {


  counterA = 0;
  counterB = 0;
  counterC = 0;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.animateCounter(60989, value => this.counterA = value);
    this.animateCounter(12345, value => this.counterB = value);
    this.animateCounter(9876, value => this.counterC = value);
  }

  private animateCounter(
    target: number,
    setValue: (value: number) => void,
    duration = 2000
  ): void {

    const startTime = performance.now();

    const step = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      setValue(Math.floor(progress * target));

      this.cd.detectChanges();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setValue(target);
        this.cd.detectChanges();
      }
    };

    requestAnimationFrame(step);
  }

}



