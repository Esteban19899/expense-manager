import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Expense } from '../models/expense';

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

  constructor(private http: HttpClient) { }


  // 📥 GET - Obtener todos los gastos
  loadExpenses(): void {
    this.http.get<Expense[]>(this.apiUrl).subscribe({
      next: (data) => this.expensesSubject.next(data),
      error: (error) => console.error('Error al obtener los gastos:', error)
    });
  }

  // ➕ POST - Agregar un nuevo gasto
  addExpense(expense: Omit<Expense, 'id'>) : void {
    this.http.post<Expense>(this.apiUrl, expense).subscribe({
      next: (newExpense) => {
        const current = this.expensesSubject.value;
        this.expensesSubject.next([...current, newExpense]);
      },
      error: (error) => console.error('Error al agregar gasto', error)
      });
    }

  // 📝 PUT - Actualizar gasto existente
  updateExpense(expense: Expense) : void {
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
  
}
