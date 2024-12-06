import { Injectable } from '@angular/core';
import { Livro } from '../models/livro.model';

@Injectable({
  providedIn: 'root',
})
export class LivroService {
  private chaveLocalStorage = 'livros';

  constructor() {}

  obterLivros(): Livro[] {
    const livrosString = localStorage.getItem(this.chaveLocalStorage);
    return livrosString ? JSON.parse(livrosString) : [];
  }

  salvarLivros(livros: Livro[]): void {
    localStorage.setItem(this.chaveLocalStorage, JSON.stringify(livros));
  }

  adicionarLivro(livro: Livro): void {
    const livros = this.obterLivros();

    const ultimoId = livros.length > 0 ? Math.max(...livros.map((livro) => livro.id)) : 0;
    livro.id = ultimoId + 1;

    livros.push(livro);
    this.salvarLivros(livros);
  }

  editarStatus(id: number, novoStatus: string): void {
    const livros = this.obterLivros();
    const livro = livros.find((livro) => livro.id === id);

    if (livro) {
      livro.status = novoStatus;
      this.salvarLivros(livros);
    }
  }

  atualizarProgresso(id: number, paginaAtual: number, totalPaginas: number): void {
    const livros = this.obterLivros();
    const livro = livros.find((livro) => livro.id === id);

    if (livro) {
      livro.paginaAtual = Math.min(paginaAtual, totalPaginas);
      livro.totalPaginas = totalPaginas;
      this.salvarLivros(livros);
    }
  }

  adicionarNota(id: number, nota: string): void {
    const livros = this.obterLivros();
    const livro = livros.find((livro) => livro.id === id);

    if (livro) {
      livro.nota = nota;
      this.salvarLivros(livros);
    }
  }

  adicionarFavorito(id: number, trecho: string): void {
    const livros = this.obterLivros();
    const livro = livros.find((livro) => livro.id === id);

    if (livro) {
      livro.favorito = trecho;
      this.salvarLivros(livros);
    }
  }

  excluirLivro(id: number): void {
    const livros = this.obterLivros().filter((livro) => livro.id !== id);
    this.salvarLivros(livros);
  }
}
