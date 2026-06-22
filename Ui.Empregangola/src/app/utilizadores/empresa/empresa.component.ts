import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BesidebarComponent } from '../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../shared/befooter/befooter.component';
import { SuccessUtilizadorComponent } from '../../modals/success-utilizador/success-utilizador.component';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../auth/auth.service';

import { EmpresaService } from '../../services/empresa/empresa.service';
// https:// labs.google/fx/pt/tools/flowhttps://labs.google/fx/pt/tools/flow deepmind.google/models/veo/ deepmind.google/models/veo/
import{
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent
  ],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css',
})

export class EmpresaComponent implements OnInit
{
  form: FormGroup = new FormGroup({});
  
  constructor (
    private fb: FormBuilder,
    private authService: AuthService,
    private empresaService: EmpresaService,
    private dialog: MatDialog 
  ) { 
    this.form = this.fb.group({
      nomeEmpresa: ['', [Validators.required, Validators.minLength(3)]],
      nif: ['', [Validators.required, Validators.minLength(3)]],
      sectorActividade: ['', [Validators.required]],
      nColaboradores: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      provincia: ['', [Validators.required, Validators.minLength(3)]],
      municipio: ['', [Validators.required, Validators.minLength(3)]],
      nomeResponsavel: ['', [Validators.required, Validators.minLength(3)]],
      cargo: ['', [Validators.required, Validators.minLength(3)]],
      emailCorporativo: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(/^\+[0-9]{12}$/)]],
      interesses: this.fb.array([]),
      sobreEmpresa: ['']
    });
  }

  get interesses()
  {
    return this.form.get('interesses') as FormArray;
  }

  onCheckboxChange(event: any)
  {
    if (event.target.checked){
      this.interesses.push(this.fb.control(Number(event.target.value)));
    }else{
      const index = this.interesses.controls.findIndex(x => x.value == Number(event.target.value));
      this.interesses.removeAt(index);
    }
  }

  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

  guardar(){
    
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
  }

  const dados = this.form.value;

  const token = localStorage.getItem('token');
  const decoded = this.decodeToken(token!);

  const appUserId = decoded.sub || decoded.nameid || decoded.uid || decoded.id;

    const dto = {
      appUserId : appUserId,
      companyName : dados.nomeEmpresa,
      taxNumber : dados.nif,
      activitySectorId : Number(dados.sectorActividade),
      employeeCountId : Number(dados.nColaboradores),
      countryId : Number(dados.pais),
      provincy : dados.provincia,
      municipality : dados.municipio,
      personResponsible : dados.nomeResponsavel,
      position : dados.cargo,
      corporateEmail : dados.emailCorporativo,
      phone : dados.telefone,
      interestIds : dados.interesses,
      aboutCompany : dados.sobreEmpresa
    }

    this.empresaService.guardarEmpresa(dto).subscribe({
      next: () => {
        this.dialog.open(SuccessUtilizadorComponent, {
          width: '350px'
        });
        console.log("Empresa guardada com sucesso!");
      },
      error: (err) => {
        console.error("Erro ao guardar empresa:", err);
      }
    });
  }

  ngOnInit(){
    const appUserId = this.authService.getUserIdFromToken();
    if(!appUserId) return;

    this.carregarEmpresa(appUserId);
  }

  isInteresseSelecionado(id: number): boolean
  {
    return this.interesses.value.includes(id);
  }

  carregarEmpresa(appUserId : string){
    this.empresaService.getCompanyDetails(appUserId).subscribe({
      next: (res) => {
        this.form.patchValue
        ({
          appUserId: appUserId,
          nomeEmpresa : res.companyName,
          nif : res.taxNumber,
          sectorActividade: res.activitySectorId,
          nColaboradores : res.employeeCountId,
          pais : res.countryId,
          provincia : res.provincy,
          municipio : res.municipality,
          nomeResponsavel : res.personResponsible,
          cargo : res.position,
          emailCorporativo : res.corporateEmail,
          telefone : res.phone,
          sobreEmpresa : res.aboutCompany
        });

        this.interesses.clear();
        if (res.interestIds) {
          res.interestIds.forEach((id: number) => {
            this.interesses.push(this.fb.control(id));
          });
        }
      },

      error: (err) => {
        console.error("Erro ao inserir a empresa", err);
      }
    });
  }
}
