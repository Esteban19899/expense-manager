import { computed, Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Expense } from '../models/expense';
import { Transaccion } from '../models/transaccion';
import { toSignal } from '@angular/core/rxjs-interop';
import { SupabaseService } from './supabase.service';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
// 🏦 Servicio para manejar gastos
export class ExpenseService {

  // 🧠 Fuente de verdad: almacena y emite los datos actuales
  private expensesSubject = new BehaviorSubject<Expense[]>([]);

  // 🌐 Exposición segura: los componentes pueden leer pero no modificar
  public expenses$: Observable<Expense[]> = this.expensesSubject.asObservable();

  // Convertir el observable público a una señal privada dentro del servicio para usar `computed`
  private allExpensesSignal = toSignal(this.expenses$, { initialValue: [] })

  constructor(private supabaseService: SupabaseService, private categoryService: CategoryService) {
    this.loadExpenses();
  }

  private loaded = false;

  // 📥 GET - Obtener todos los gastos (carga inicial)
  async loadExpenses(): Promise<void> {
    if (this.loaded) return;
    this.loaded = true;

    // 1. Obtener la sesión del usuario para la seguridad
    const { data: { session } } = await this.supabaseService.supabaseClient.auth.getSession();
    if (!session) {
      console.error('No hay una sesión activa para cargar transacciones.');
      return;
    }

    // 2. Usar una consulta con "JOIN" para obtener el nombre de la categoría
    const { data, error } = await this.supabaseService.supabaseClient
      .from('transaccion') // Tu tabla de transacciones
      .select(`
      id,
      nombre,
      monto,
      fecha,
      tipo,
      categoria:categoria_id (nombre) // 👈 Aquí se trae el nombre de la categoría
    `)
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error al obtener los gastos:', error);
      this.expensesSubject.next([]);
    } else {
      // 3. Mapear los datos para que coincidan con el modelo Expense
      const expenses = data.map((item: any) => ({
        id: item.id,
        nombre: item.nombre,
        monto: item.monto,
        fecha: item.fecha,
        categoria: item.categoria.nombre // 👈 Se accede al nombre de la categoría
      }));

      // 4. Actualizar el BehaviorSubject para que los componentes se actualicen
      this.expensesSubject.next(expenses as Expense[]);
    }
  }


  // ➕ POST - Agregar un nuevo gasto
  async addExpense(expense: Expense): Promise<void> {
    // 1. Obtener la sesión del usuario
    const { data: { session } } = await this.supabaseService.supabaseClient.auth.getSession();
    if (!session) {
      console.error('No hay una sesión activa para agregar un gasto.');
      return;
    }

    // 2. Usar el CategoryService para obtener el ID de la categoría
    const categoriaId = this.categoryService.getCategoryIdByName(expense.categoria);
    if (categoriaId === undefined) {
      console.error(`Categoría "${expense.categoria}" no encontrada.`);
      return;
    }

    // 3. Construir el objeto para la base de datos (modelo Transaccion)
    const transactionToInsert: Omit<Transaccion, 'id'> = {
      usuario_id: session.user.id,
      categoria_id: categoriaId,
      nombre: expense.nombre,
      monto: expense.monto,
      tipo: 'EGRESO', // Usar el tipo correcto de tu ENUM
      fecha: expense.fecha,
    };

    // 4. Insertar el objeto en la tabla 'transaccion'
    const { data, error } = await this.supabaseService.supabaseClient
      .from('transaccion')
      .insert(transactionToInsert)
      .select(`
      id,
      nombre,
      monto,
      fecha,
      tipo,
      categoria:categoria_id (nombre)
    `); // Pedimos los datos necesarios para el frontend

    if (error) {
      console.error('Error al agregar gasto:', error);
    } else {
      // 5. Mapear el resultado a un objeto del frontend (modelo Expense) y actualizar el Subject
      const newExpense = {
        id: (data as any)[0].id,
        nombre: (data as any)[0].nombre,
        monto: (data as any)[0].monto,
        fecha: (data as any)[0].fecha,
        categoria: (data as any)[0].categoria.nombre,
      }
      const current = this.expensesSubject.value;
      this.expensesSubject.next([...current, newExpense]);
    }
  }

  // 📝 PUT - Actualizar gasto existente (No necesario por el momento)


  // 🗑️ DELETE - Eliminar un gasto
  async deleteExpense(id: string): Promise<void> {
    const { data: { session } } = await this.supabaseService.supabaseClient.auth.getSession();
    if (!session) {
      console.error('No hay una sesión activa para eliminar una transacción.');
      return;
    }

    const { error } = await this.supabaseService.supabaseClient
      .from('transaccion')
      .delete()
      .eq('id', id)
      .eq('usuario_id', session.user.id); // 👈 Filtramos por el ID del usuario para mayor seguridad

    if (error) {
      console.error('Error al eliminar gasto:', error);
    } else {
      // Si la eliminación fue exitosa, actualizamos el estado en la aplicación
      const current = this.expensesSubject.value.filter(e => e.id !== id);
      this.expensesSubject.next(current);
    }
  }

  // 📅 Gasto Total - Acumulado mes en curso 
  totalCurrentMonthExpenses = computed(() => {
    const expensesList = this.allExpensesSignal(); // Accede a la señal de gastos
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-11
    const currentYear = today.getFullYear();

    let total = 0;
    expensesList.forEach(exp => {
      // Parseo robusto de la fecha por inconsistencia entre la hora local y getMonth() de javascript.
      const [year, month, day] = exp.fecha.split('-').map(Number);
      const expenseDate = new Date(year, month - 1, day);

      if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
        total += exp.monto;
      }
    });
    return total;
  });

  // Nueva señal computada para el nombre del mes actual
  currentMonthName = computed(() => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril',
      'Mayo', 'Junio', 'Julio', 'Agosto',
      'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ];
    const today = new Date();
    return months[today.getMonth()];
  });

}
