import { Component, ElementRef, ViewChild } from '@angular/core';
import { BesidebarComponent } from '../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../shared/befooter/befooter.component';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent
  ],
  templateUrl: './facturas.component.html',
  styleUrl: './facturas.component.css',
})
export class FacturasComponent {
   @ViewChild('detailsDialog', { static: true }) detailsDialog!: ElementRef<HTMLDialogElement>;
 
  openDetails(): void {
    this.detailsDialog.nativeElement.showModal();
  }
 
  closeDetails(): void {
    this.detailsDialog.nativeElement.close();
  }
 
  /** Clicar no fundo escuro (fora do cartão) fecha o modal. */
  onDialogClick(event: MouseEvent): void {
    if (event.target === this.detailsDialog.nativeElement) {
      this.closeDetails();
    }
  }
}
