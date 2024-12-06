export interface Livro {
    id: number;
    titulo: string;
    autor: string;
    status: string; 
    paginaAtual: number;
    totalPaginas: number;
    nota?: string; 
    favorito?: string;
  }
  