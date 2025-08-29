// 🧾 Modelo de gasto
export interface Expense {
    id: string;
    nombre: string;
    monto: number;
    categoria: string;
    fecha: string; // Formato ISO YYYY-MM-DD
    user_id?: string
}


/* Este modelo es un objeto de transferencia de datos (DTO). Es un objeto temporal que solo vive en tu aplicación de Angular
 y se usa para representar la información que el usuario ingresa en el formulario de gastos.

Propósito: Recopilar y transportar los datos del formulario a la capa de servicio.
Contenido: Contiene los datos que el usuario puede ver y editar: nombre, monto, categoria (el nombre), y fecha.
Ejemplo: Cuando un usuario llena el formulario y selecciona "Alimentación" para la categoría, este modelo almacena la cadena de texto "Alimentación". */