import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense';
// Importacion componentes standalone
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { ExpenseListComponent } from '../expense-list/expense-list.component';
import { SummaryCardComponent } from '../summary-card/summary-card.component';
import { MonthlyChartComponent } from '../monthly-chart/monthly-chart.component';
import { CategoryChartComponent } from '../category-chart/category-chart.component';



@Component({
  selector: 'app-dashboard',
 imports: [
    CommonModule,
    ExpenseFormComponent,
    ExpenseListComponent,
    SummaryCardComponent,
    CategoryChartComponent,
    MonthlyChartComponent
  ],
            
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private expenseService = inject(ExpenseService);
  

  // Estado: gasto que se quiere editar
  expenseToEdit?: Expense = undefined;

  constructor() {
    this.expenseService.loadExpenses();
  }

  onEdit(expense: Expense) {
    this.expenseToEdit = expense;
  }

  onSubmit(expense: Expense) {
    if (expense.id) {
      this.expenseService.updateExpense(expense);
    } else {
      this.expenseService.addExpense(expense);
    }
    this.expenseToEdit = undefined;
  }

  onCancelEdit() {
    this.expenseToEdit = undefined;
  }
}
