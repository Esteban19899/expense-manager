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
  chartData = computed(() => {
    const data = this.expenses();
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-11
    const currentYear = today.getFullYear();
    const categories = [
      'Hogar',          // 1
      'Salud',          // 2
      'Servicios',      // 3
      'Educacion',      // 4
      'Entretenimiento',// 5
      'Alimentacion',   // 6
      'Transporte',     // 7
      'Vestimenta',     // 8
      'Otros'           // 9
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
            '#009688',   // Hogar 
            '#f04d4d',   // Salud 
            '#f0c24d',   // Servicios 
            '#4d68f0',   // Educación 
            '#9C27B0',   // Entretenimiento 
            '#FB8C00',   // Alimentación 
            '#1fbd5c',   // Transporte 
            '#f04d8e',   // Vestimenta 
            '#9E9E9E'    // Otros (Gris neutro)

          ],
        },
      ],
    };
  });

  // Opciones del gráfico tipo torta
  public chartOptions: ChartOptions<ChartType> = { // 'public' es una buena práctica aquí
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      // Puedes añadir más plugins aquí, por ejemplo para tooltips o datalabels
    },
    // Otras opciones específicas del gráfico de torta
  };

  public chartType: ChartType = 'pie'; // 'public' es una buena práctica aquí
}