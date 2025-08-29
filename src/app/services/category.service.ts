// src/app/services/category.service.ts
import { Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Categoria } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // Una señal para almacenar las categorías.
  // Es privada para que solo el servicio pueda modificarla.
  private _categoriasSignal = signal<Categoria[]>([]);

  // Una señal pública de solo lectura para que los componentes puedan acceder a los datos.
  readonly categoriasSignal = this._categoriasSignal.asReadonly();

  constructor(private supabaseService: SupabaseService) {
    this.loadCategories(); // Cargamos las categorías al iniciar el servicio.
  }

  async loadCategories(): Promise<void> {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('categoria')
      .select('id, nombre');

    if (error) {
      console.error('Error al cargar categorías:', error);
    } else {
      // Actualizamos la señal con los datos.
      this._categoriasSignal.set(data as Categoria[]);
    }
  }

  // Método para obtener el ID de una categoría por su nombre.
  getCategoryIdByName(nombre: string): number | undefined {
    const categoria = this.categoriasSignal().find(cat => cat.nombre === nombre);
    return categoria?.id;
  }
}