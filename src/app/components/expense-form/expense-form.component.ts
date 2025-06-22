import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Expense } from '../../models/expense';


@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense-form.component.html',
})
export class ExpenseFormComponent implements OnChanges {
  @Input() expense?: Expense; // Si viene, es edición
  @Output() submit = new EventEmitter<Expense>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      monto: [0, [Validators.required, Validators.min(1)]],
      categoria: ['Otros', Validators.required],
      fecha: [this.hoy(), Validators.required],
    });
  }

  // Se llama cuando cambia el input (por ejemplo, al hacer clic en "Editar")
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expense'] && this.expense) {
      this.form.patchValue(this.expense);
    } else if (!this.expense) {
      this.form.reset({
        nombre: '',
        monto: 0,
        categoria: 'Otros',
        fecha: this.hoy()
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const result: Expense = {
      ...formValue,
      id: this.expense?.id ?? undefined // si estamos editando, conserva el id
    };

    this.submit.emit(result);
    this.form.reset(); // opcional: limpiar después de enviar
  }

  onCancel() {
    this.cancel.emit();
    this.form.reset();
  }

  private hoy(): string {
    return new Date().toISOString().split('T')[0];
  }
}
