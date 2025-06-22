import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense';

@Component({
  selector: 'app-expense-list',
  imports: [CommonModule],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss'
})
export class ExpenseListComponent {
   private expenseService = inject(ExpenseService);

   // Convierto observable a signal para usar con @for/@if
   expenses = toSignal(this.expenseService.expenses$);

   // Evento para cuando se quiere editar un gasto
  @Output() editExpense = new EventEmitter<Expense>();


  delete(id: number) {
    this.expenseService.deleteExpense(id);
  }

  edit(expense : Expense) {
    this.editExpense.emit(expense);
  }


}
