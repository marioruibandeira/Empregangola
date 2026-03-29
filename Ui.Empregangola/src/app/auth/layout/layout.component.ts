import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class AuthLayoutComponent { }
