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

 expenses = toSignal(this.expenseService.expenses$);

  // Computed: total gastado sumando monto de todos los gastos
  total = computed(() => {
    const list = this.expenses(); // expenses$ convertido a signal
    return list?.reduce((acc, e) => acc + e.monto, 0) ?? 0;
  });
}
