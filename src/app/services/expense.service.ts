import { computed, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Expense } from '../models/expense';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
// 🏦 Servicio para manejar gastos
export class ExpenseService {

  // 🔒 URL de MockAPI
  private apiUrl = 'https://6854bf876a6ef0ed662fec96.mockapi.io/expenses';

  // 🧠 Fuente de verdad: almacena y emite los datos actuales
  private expensesSubject = new BehaviorSubject<Expense[]>([]);

  // 🌐 Exposición segura: los componentes pueden leer pero no modificar
  public expenses$: Observable<Expense[]> = this.expensesSubject.asObservable();
  
  // Convertir el observable público a una señal privada dentro del servicio para usar `computed`
  private allExpensesSignal = toSignal(this.expenses$, { initialValue: [] })

  constructor(private http: HttpClient) { }


  // 📥 GET - Obtener todos los gastos (carga inicial)
  private loaded = false;

  loadExpenses(): void {
    if (this.loaded) return;
    this.loaded = true;
    this.http.get<Expense[]>(this.apiUrl).subscribe({
      next: (data) => this.expensesSubject.next(data),
      error: (error) => console.error('Error al obtener los gastos:', error)
    });
  }


  // ➕ POST - Agregar un nuevo gasto
  addExpense(expense: Omit<Expense, 'id'>): void {
    this.http.post<Expense>(this.apiUrl, expense).subscribe({
      next: (newExpense) => {
        const current = this.expensesSubject.value;
        this.expensesSubject.next([...current, newExpense]);
      },
      error: (error) => console.error('Error al agregar gasto', error)
    });
  }

  // 📝 PUT - Actualizar gasto existente
  updateExpense(expense: Expense): void {
    const url = `${this.apiUrl}/${expense.id}`;
    this.http.put<Expense>(url, expense).subscribe({
      next: (updated) => {
        const current = this.expensesSubject.value.map(e =>
          e.id === updated.id ? updated : e
        );
        this.expensesSubject.next(current);
      },
      error: (error) => console.error('Error al editar gasto:', error)
    });
  }

  // 🗑️ DELETE - Eliminar un gasto
  deleteExpense(id: number): void {
    const url = `${this.apiUrl}/${id}`;
    this.http.delete<void>(url).subscribe({
      next: () => {
        const current = this.expensesSubject.value.filter(e => e.id !== id);
        this.expensesSubject.next(current);
      },
      error: (error) => console.error('Error al eliminar gasto:', error)
    });
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
