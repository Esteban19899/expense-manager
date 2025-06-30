import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-card.component.html',
})
export class SummaryCardComponent {
  private expenseService = inject(ExpenseService);

  // Total gastos mes actual
  total = this.expenseService.totalCurrentMonthExpenses;
}
