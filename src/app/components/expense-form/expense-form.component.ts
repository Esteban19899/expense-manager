import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense-form.component.html',
})
export class ExpenseFormComponent {
  form: FormGroup;
  formSubmitted: boolean = false; // Propiedad para controlar si se intentó enviar

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      categoria: ['Otros', Validators.required],
      fecha: [this.hoy(), Validators.required]
    });
  }

  onSubmit() {
    this.formSubmitted = true; // Al hacer submit, marcamos que se intentó enviar

    if (this.form.valid) {
      console.log('Formulario válido:', this.form.value);
      this.expenseService.addExpense(this.form.value);
      this.form.reset({
        nombre: '',
        monto: null,
        categoria: 'Otros',
        fecha: this.hoy()
      });
      this.formSubmitted = false; // Si el envío fue exitoso, restablecemos la bandera
    } else {
      console.log('Formulario inválido. Por favor, revisa los campos.');
    }
  }

  private hoy(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Método para determinar si se debe mostrar un error
  shouldShowError(controlName: string): boolean {
    const control = this.form.get(controlName);
    // Mostrar error si el control es inválido Y el formulario ya ha sido intentado enviar
    return !!control && control.invalid && this.formSubmitted;
  }
}