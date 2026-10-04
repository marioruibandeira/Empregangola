import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BesidebarComponent } from '../../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../../shared/befooter/befooter.component';
import { AuthService } from '../../../auth/auth.service';
import { NovasVagasService } from '../../../services/empresa/novas-vagas/novas-vagas.service';
import { ProvinceService, ProvinceDTO } from '../../../services/shared/province.service';
import { CategoryService, CategoryDTO } from '../../../services/shared/category.service';
//import { SuccessVagaComponent } from '../success-vaga/success-vaga.component';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-novas-vagas',
  standalone: true,
  imports: [
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent,
    ReactiveFormsModule
  ],
  templateUrl: './novas-vagas.component.html',
  styleUrl: './novas-vagas.component.css',
})
export class NovasVagasComponent {
  form: FormGroup = new FormGroup({});
  provincias: ProvinceDTO[] = [];
  categorias: CategoryDTO[] = [];

  beneficiosDisponiveis = [
    'Seguro de saúde',
    'Subsídio de transporte',
    'Subsídio de alimentação',
    'Alojamento',
    'Formação paga',
    'Bónus por desempenho'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private novasVagasService: NovasVagasService,
    private dialog: MatDialog,
    private provinceService: ProvinceService,
    private categoryService: CategoryService

  ) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      categoria: ['', [Validators.required]],
      numeroVagas: ['', [Validators.required, Validators.min(1), Validators.max(50)]],
      contrato: ['', [Validators.required]],
      modalidade: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      municipio: ['', [Validators.required, Validators.minLength(3), Validators.max(50)]],
      diaspora: [false],
      descricao: ['', [Validators.required]],
      responsabilidades: ['', [Validators.required]],
      requisitos: ['', [Validators.required]],
      escolaridade: ['', [Validators.required]],
      experiencia: ['', [Validators.required]],
      idiomas: ['', [Validators.required]],
      competencias: ['', [Validators.required]],
      salarioMin: ['', [Validators.required]],
      salarioMax: ['', [Validators.required]],
      aCombinar: [false],
      beneficios: this.fb.array(
        this.beneficiosDisponiveis.map(() => this.fb.control(false))
      ),
      prazo: ['', [Validators.required]],
      candidatura: ['Plataforma'],
      candidaturaDestino: [''],
    });
  }

  get titulo() { return this.form.get('titulo'); }
  get categoria() { return this.form.get('categoria'); }
  get numeroVagas() { return this.form.get('numeroVagas'); }
  get contrato() { return this.form.get('contrato'); }
  get modalidade() { return this.form.get('modalidade'); }
  get provincia() { return this.form.get('provincia'); }
  get municipio() { return this.form.get('municipio'); }
  get descricao() { return this.form.get('descricao'); }
  get prazo() { return this.form.get('prazo'); }
  get candidatura() { return this.form.get('candidatura'); }
  get beneficios() { return this.form.get('beneficios') as FormArray; }

  ngOnInit(): void {
    this.provinceService.getAll().subscribe({
      next: (dados) => this.provincias = dados,
      error: (err) => console.error('Erro ao carregar províncias:', err)
    });

    this.categoryService.getAll().subscribe({
      next: (dados) => this.categorias = dados,
      error: (err) => console.error('Erro ao carregar categorias:', err)   
    });
  }

  guardarNovaVaga() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dados = this.form.value;

    const beneficiosSelecionados = dados.beneficios
      .map((selecionado: boolean, index: number) => selecionado ? this.beneficiosDisponiveis[index] : null)
      .filter((b: string | null): b is string => b !== null);

    const dto = {
      title: dados.titulo,
      categoryId: Number(dados.categoria),
      numberOfVacancies: Number(dados.numeroVagas),
      contractType: dados.contrato,
      workMode: dados.modalidade,
      provinceId: Number(dados.provincia),
      municipality: dados.municipio,
      diaspora: dados.diaspora,
      description: dados.descricao,
      responsibilities: dados.responsabilidades,
      requirements: dados.requisitos,
      educationLevel: dados.escolaridade,
      experienceLevel: dados.experiencia,
      languages: dados.idiomas,
      skills: dados.competencias,
      salaryMin: Number(dados.salarioMin),
      salaryMax: Number(dados.salarioMax),
      negotiableSalary: dados.aCombinar,
      benefits: beneficiosSelecionados,
      deadline: dados.prazo,
      applicationMethod: dados.candidatura,
      applicationTarget: dados.candidaturaDestino
    };

    this.novasVagasService.guardarVaga(dto).subscribe({
      next: () => {
        // this.dialog.open(SuccessVagaComponent, {
        //   width: '350px'
        // });
        console.log('Vaga guardada com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao guardar vaga:', err);
      }
    });
  }
}
