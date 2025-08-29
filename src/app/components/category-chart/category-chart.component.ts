import { Component, inject, computed } from '@angular/core'; // Asegúrate de importar 'computed'
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-category-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './category-chart.component.html',
  styleUrls: ['./category-chart.component.scss']
})
export class CategoryChartComponent {
  private expenseService = inject(ExpenseService);
  expenses = toSignal(this.expenseService.expenses$, { initialValue: [] });

  currentMonthName = this.expenseService.currentMonthName();

  // Cálculo de montos por categoría
// En tu CategoryChartComponent
chartData = computed(() => {
    const data = this.expenses();
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-11
    const currentYear = today.getFullYear();
    const categories = [
      'Hogar',
      'Salud',
      'Servicios',
      'Educacion',
      'Entretenimiento',
      'Alimentacion',
      'Transporte',
      'Vestimenta',
      'Otros'
    ];
    const amounts = categories.map(cat =>
      data.filter(e => {
        const [year, month, day] = e.fecha.split('-').map(Number);
        const expenseDate = new Date(year, month - 1, day);
        return e.categoria === cat &&
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear;
      }).reduce((sum, e) => sum + e.monto, 0)
    );

    return {
      labels: categories,
      datasets: [
        {
          data: amounts,
          backgroundColor: [
            '#009688',
            '#f04d4d',
            '#f0c24d',
            '#4d68f0',
            '#9C27B0',
            '#FB8C00',
            '#1fbd5c',
            '#f04d8e',
            '#9E9E9E'
          ],
        },
      ],
    };
});
  // Opciones del gráfico tipo torta
  public chartOptions: ChartOptions<ChartType> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  public chartType: ChartType = 'pie';
}