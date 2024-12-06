import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LivroService } from '../services/livro.service';
import { Livro } from '../models/livro.model';

@Component({
  selector: 'app-livros',
  templateUrl: './livros.page.html',
  styleUrls: ['./livros.page.scss'],
})
export class LivrosPage {
  livros: Livro[] = [];
  livrosFiltrados: Livro[] = [];
  statusFiltro: string = '';

  constructor(private livroService: LivroService, private alertCtrl: AlertController) {}

  ionViewWillEnter() {
    this.carregarLivros();
  }

  carregarLivros() {
    this.livros = this.livroService.obterLivros();
    this.filtrarLivros();
  }

  async abrirFormularioAdicionar() {
    const alert = await this.alertCtrl.create({
      header: 'Adicionar Livro',
      inputs: [
        { name: 'titulo', type: 'text', placeholder: 'Título' },
        { name: 'autor', type: 'text', placeholder: 'Autor' },
        {
          name: 'status',
          type: 'radio',
          label: 'Lido',
          value: 'lido',
          checked: true,
        },
        {
          name: 'status',
          type: 'radio',
          label: 'Lendo',
          value: 'lendo',
          checked: true,
        },
        {
          name: 'status',
          type: 'radio',
          label: 'Pendente',
          value: 'pendente',
          checked: true,
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Adicionar',
          handler: (data) => {
            if (!data.titulo || !data.autor || !data.status) {
              alert.message = 'Todos os campos são obrigatórios!';
              return false;
            }
            const novoLivro: Livro = {
              id: Date.now(),
              titulo: data.titulo,
              autor: data.autor,
              status: data.status,
              paginaAtual: 0,
              totalPaginas: 0,
              nota: '',
              favorito: '',
            };
            this.livroService.adicionarLivro(novoLivro);
            this.carregarLivros();
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  async editarStatus(livro: Livro) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Status',
      inputs: [
        {
          name: 'status',
          type: 'radio',
          label: 'Lido',
          value: 'lido',
          checked: livro.status === 'lido',
        },
        {
          name: 'status',
          type: 'radio',
          label: 'Lendo',
          value: 'lendo',
          checked: livro.status === 'lendo',
        },
        {
          name: 'status',
          type: 'radio',
          label: 'Pendente',
          value: 'pendente',
          checked: livro.status === 'pendente',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: (data) => {
            if (!data) {
              alert.message = 'Você deve selecionar um status!';
              return false;
            }
            this.livroService.editarStatus(livro.id, data);
            this.carregarLivros();
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  async registrarProgresso(livro: Livro) {
    const alert = await this.alertCtrl.create({
      header: 'Registrar Progresso',
      inputs: [
        { name: 'paginaAtual', type: 'number', value: livro.paginaAtual || 0, placeholder: 'Página atual' },
        { name: 'totalPaginas', type: 'number', value: livro.totalPaginas || '', placeholder: 'Total de páginas' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: (data) => {
            const paginaAtual = +data.paginaAtual;
            const totalPaginas = +data.totalPaginas;

            if (!paginaAtual || !totalPaginas || paginaAtual > totalPaginas) {
              alert.message = 'Sua página de leitura atual não pode ser maior que o total de páginas do livro!';
              return false;
            }

            this.livroService.atualizarProgresso(livro.id, paginaAtual, totalPaginas);
            this.carregarLivros();
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  async adicionarNota(livro: Livro) {
    const alert = await this.alertCtrl.create({
      header: 'Adicionar Nota',
      inputs: [{ name: 'nota', type: 'textarea', placeholder: 'Escreva sua nota aqui (0/10)' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: (data) => {
            if (!data.nota) {
              alert.message = 'A nota não pode estar vazia!';
              return false;
            }
            this.livroService.adicionarNota(livro.id, data.nota);
            this.carregarLivros();
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  async marcarFavorito(livro: Livro) {
    const alert = await this.alertCtrl.create({
      header: 'Marcar Trecho Favorito',
      inputs: [{ name: 'trecho', type: 'textarea', placeholder: 'Digite o trecho aqui' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: (data) => {
            if (!data.trecho) {
              alert.message = 'O trecho não pode estar vazio!';
              return false;
            }
            this.livroService.adicionarFavorito(livro.id, data.trecho);
            this.carregarLivros();
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  excluirLivro(id: number) {
    this.livroService.excluirLivro(id);
    this.carregarLivros();
  }

  filtrarLivros() {
    if (this.statusFiltro) {
      this.livrosFiltrados = this.livros.filter((livro) => livro.status === this.statusFiltro);
    } else {
      this.livrosFiltrados = [...this.livros];
    }
  }
}
