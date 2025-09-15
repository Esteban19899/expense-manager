# ADondeSeMeFue💸
Un gestor de gastos personales diseñado para ayudarte a registrar y visualizar tus finanzas de manera sencilla.

## 👨‍💻 Datos Personales

* **Nombre y Apellido:** Esteban Villanueva
* **Email:** estebangv.2023@gmail.com
* **Sede:** Tandil

## 🚀 Tecnologías

* **Frontend:** Angular (versión 20.0.3)
* **Estilos:** Bootstrap 5
* **Iconos:** Bootstrap Icons
* **Gráficos:** (Ng2-Charts)

## ✨ Características (MVP)

* Registro de nuevos gastos con detalles como nombre, monto, categoría y fecha.
* Visualización del total de gastos incurridos en el mes actual.
* Gráficos que muestran la evolución mensual de tus gastos.
* Gráficos de distribución de gastos por categoría.
* Historial de todos los gastos registrados.

## ⚙️ Servicio de Gestión de Gastos y Reactividad

La aplicación utiliza un servicio centralizado (`ExpenseService`) para gestionar todos los datos relacionados con los gastos, implementando un patrón de reactividad moderno de Angular.

* **Fuente de Datos:** Para propósitos de prueba y desarrollo, el servicio se conecta a un **MockAPI**. Esto simula una API de backend real sin la necesidad de un servidor complejo.
* **Gestión de Estado (BehaviorSubject):** El servicio utiliza un `BehaviorSubject` de RxJS (`expensesSubject`) como **fuente centralizada de verdad** para el estado de los gastos. Todas las operaciones (agregar, actualizar, eliminar) modifican este `BehaviorSubject`, el cual luego emite el nuevo estado.
* **Exposición Pública (Observable):** El servicio expone un `Observable<Expense[]>` público (`expenses$`) derivado del `BehaviorSubject` (usando `asObservable()`). Este observable es solo de lectura, lo que previene que los componentes modifiquen directamente el estado encapsulado del servicio.
* **Integración con Signals (`toSignal` y `computed`):**
    * **Dentro del Servicio:** El `Observable` público (`expenses$`) se convierte en una Signal privada (`allExpensesSignal`) utilizando la función `toSignal` de `@angular/core/rxjs-interop`. Esto permite al servicio definir **Signals computadas (`computed`)** (como `totalCurrentMonthExpenses` y `currentMonthName`) que reaccionan automáticamente a los cambios en los datos de gastos, sin la necesidad de suscripciones explícitas dentro del propio servicio.
    * **En los Componentes:** Los componentes (`CategoryChartComponent`, etc.) también utilizan `toSignal` para convertir el `Observable` `expenses$` del servicio en una `Signal` local. Esto significa que los componentes **no necesitan suscribirse manualmente** ni usar el `async` pipe en sus plantillas. Acceden a los datos llamando a la Signal como una función (`expenses()`), y Angular se encarga de la detección de cambios y la actualización de la vista de forma eficiente.

Este enfoque combina la robustez de la gestión de estado centralizada con `BehaviorSubject` y la simplicidad y el rendimiento del nuevo sistema de reactividad basado en Signals de Angular.

---

## 🔗 Enlace a StackBlitz

Puedes ver y explorar este proyecto en vivo y en un entorno editable de StackBlitz aquí:

[**Abrir ADondeSeMeFue en StackBlitz**](https://stackblitz.com/~/github.com/Esteban19899/expense-manager)

---

## 🖥️ Uso Local

Para levantar y ejecutar esta aplicación en tu entorno local:

1.  Asegúrate de tener [Node.js](https://nodejs.org/es/) y [Angular CLI](https://angular.io/cli) instalados.
2.  Clona este repositorio:
    ```bash
    git clone https://github.com/Esteban19899/expense-manager
    ```
3.  Navega a la carpeta del proyecto:
    ```bash
    cd expense-manager
    ```
4.  Instala las dependencias:
    ```bash
    npm install
    ```
5.  Inicia la aplicación:
    ```bash
    ng serve
    ```
    La aplicación estará disponible en `http://localhost:4200/`

---
