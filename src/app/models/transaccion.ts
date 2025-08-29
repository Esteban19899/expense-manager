// src/app/models/transaccion.model.ts
export interface Transaccion {
    id?: string;
    usuario_id: string;
    categoria_id: number; // 👈 Ahora usamos el ID numérico
    nombre: string;
    monto: number;
    fecha: string;
    tipo: string;
    
}

/* Este modelo es la representación de una fila en tu base de datos. 
Es una estructura de datos que coincide exactamente con las columnas de tu tabla transaccion en Supabase.

Propósito: Asegurar que los datos que se envían a la base de datos coincidan con el esquema que definiste.
Contenido: Contiene los datos tal como la base de datos los necesita: id (uuid), usuario_id (uuid), monto, fecha, y lo más importante, categoria_id (un número).
Ejemplo: Tu base de datos no conoce el nombre "Alimentación". En cambio, espera un número, como 1, que corresponde al id de la categoría "Alimentación" 
en tu tabla categoria. */