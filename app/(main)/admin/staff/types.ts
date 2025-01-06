export type Categoria = string;
export type Subcategoria = string;
export type Cargo = string;

export interface PersonaPredefinida {
  id: string;
  nombre: string;
  cargo: Cargo;
  categoria: Categoria;
  subcategoria: Subcategoria | null;
  habitacion: number | null;
  cama: string | null;
}

export interface Habitacion {
  numero: number;
  camas: string[];
}
