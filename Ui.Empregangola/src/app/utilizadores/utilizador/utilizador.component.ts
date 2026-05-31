import { Component, OnInit } from '@angular/core';
import { UtilizadorService } from '../../services/utilizador/utilizador.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { MatDialog } from '@angular/material/dialog'
import { SuccessUtilizadorComponent } from '../../modals/success-utilizador/success-utilizador.component';
import { BesidebarComponent } from '../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../shared/befooter/befooter.component';



import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn

} from '@angular/forms';

import { CommonModule } from '@angular/common';

export function idadeMinimaValidator(idadeMinima: number): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) {
      return null;
    }

    const partes = control.value.split('-');

    if (partes.length !== 3) {
      return null;
    }

    const dia = Number(partes[0]);
    const mes = Number(partes[1]) - 1;
    const ano = Number(partes[2]);

    const dataNascimento = new Date(ano, mes, dia);
    const hoje = new Date();

    let idade = hoje.getFullYear() - dataNascimento.getFullYear();

    const mesAtual = hoje.getMonth() - dataNascimento.getMonth();

    if (
      mesAtual < 0 ||
      (mesAtual === 0 && hoje.getDate() < dataNascimento.getDate())
    ) {
      idade--;
    }

    return idade >= idadeMinima
      ? null
      : { idadeMinima: true };
  };
}

@Component({
  selector: 'app-utilizador',
  standalone:true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent
  ],
  providers: [FormBuilder],
  templateUrl: './utilizador.component.html',
  styleUrl: './utilizador.component.css',
})

export class UtilizadorComponent implements OnInit
{
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private utilizadorService: UtilizadorService,
    private authService: AuthService,
    private dialog: MatDialog)
  {
    this.form = this.fb.group({
      nomeUtilizador: [{ value: '', disabled: true }],
      nomeCompleto:['', [Validators.required, Validators.minLength(3),
        Validators.pattern(/^[A-Za-zÀ-ÿ\s]+$/)
      ]],
      telefone:['', [Validators.required, Validators.maxLength(13),
        Validators.pattern(/^\+[0-9]{12}$/)
      ]],
      email:['', [Validators.required, Validators.minLength(8),
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/)
      ]],
      caixaPostal:['',[Validators.minLength(2), Validators.maxLength(20),
        Validators.pattern(/^[a-zA-ZÀ-ÿ0-9\s\-\/]+$/)
      ]],
      pais:['',[Validators.required]],
      local:['',[Validators.required]],
      dataNascimento: ['', [
        Validators.required,
        Validators.pattern(/^\d{2}-\d{2}-\d{4}$/),
        idadeMinimaValidator(18)
      ]],
      genero: ['2', Validators.required],
      sobreMim:[''],
    });
  }

  guardar(){
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }
    
    const dados = this.form.value;

    const token = localStorage.getItem('token');
    const decoded = this.decodeToken(token!);

    const appUserId =
      decoded.sub ||
      decoded.nameid ||
      decoded.uid ||
      decoded.id;

    const dto = {
      AppUserId: appUserId,
      FullName: dados.nomeCompleto,
      Email: dados.email,
      PhoneNumber: dados.telefone,
      DateOfBirth: this.formatarData(dados.dataNascimento),
      Address: dados.sobreMim ?? "",
      PostalCode: dados.caixaPostal ?? "",
      Country: dados.pais,
      Location: dados.local,
      PhotoProfile: "",
      Genero: dados.genero,
      SobreMim: dados.sobreMim
    };

    this.utilizadorService.guardarUtilizador(dto).subscribe({
      next: (res) => {
        this.dialog.open(SuccessUtilizadorComponent, {
          width: '350px'
        });
      },
      error: (err) => console.error('Erro ao guardar utilizador:', err)
    });
  }

  formatarData(data: string): string {
    const [dia, mes, ano] = data.split('-');
    return `${ano}-${mes}-${dia}T00:00:00`;
  }

  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

  //Filtrar
  ngOnInit() {
    const appUserId = this.authService.getUserIdFromToken();
    if (!appUserId) return;
    this.carregarDados(appUserId);
  }

  carregarDados(appUserId: string) {
    this.utilizadorService.getUserDetails(appUserId).subscribe({
      next: (res) => {
        this.form.patchValue({
          appUserId: appUserId,
          nomeUtilizador: res.userName,
          nomeCompleto: res.fullName,
          email: res.email,
          telefone: res.phoneNumber,
          caixaPostal: res.postalCode,
          pais: res.country,
          local: res.location,
          dataNascimento: this.converterDataParaDDMMYYYY(res.dateOfBirth),
          genero: String(res.genero),
          sobreMim: res.sobreMim
        });
      },
      error: (err) => {
        console.error("Erro ao carregar dados:", err);
      }
    });
  }

  converterDataParaDDMMYYYY(data: string): string {
    const d = new Date(data);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}-${mes}-${ano}`;
  }

}
