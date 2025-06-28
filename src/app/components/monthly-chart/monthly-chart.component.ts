import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartType } from 'chart.js';


@Component({
  selector: 'app-monthly-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './monthly-chart.component.html',
})
export class MonthlyChartComponent {
  private expenseService = inject(ExpenseService);
  expenses = toSignal(this.expenseService.expenses$, { initialValue: [] });

  months = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  chartData = computed(() => {
    const data = this.expenses();

    const monthlyTotals = Array(12).fill(0);

    data.forEach(exp => {
      const [year, month, day] = exp.fecha.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const monthIndex = date.getMonth(); // 0–11
      monthlyTotals[monthIndex] += exp.monto;
    });

    return {
      labels: this.months,
      datasets: [
        {
          label: 'Total Gastado',
          data: monthlyTotals,
          backgroundColor: '#3b82f6',
          borderRadius: 4,
        },
      ],
    };
  });

  public chartOptions: ChartOptions<ChartType> = {
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
    plugins: {
      legend: { display: false },
    },
  };

  public chartType: ChartType = 'bar';
}
