// 🧾 Modelo de gasto
export interface Expense {
    id: number;
    nombre: string;
    monto: number;
    categoria: 'Entretenimiento' | 'Hogar' | 'Salud' | 'Educacion' | 'Otros';
    fecha: string; // Formato ISO YYYY-MM-DD
}