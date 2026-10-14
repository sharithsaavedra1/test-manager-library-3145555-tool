# Herramienta Sembradora de Demostración — Manager Library

> **Ficha ADSO 3145555 · SDD Spec-Driven Development**
> Tarea T-21: Sembrador de datos de demostración consumiendo **exclusivamente la API HTTP** (nunca SQL directo, cumpliendo §9 de `data-model.md`).

## Qué siembra

1. Autenticación como usuario `admin` para obtener token Bearer de 8 horas.
2. Consulta dinámica de las 5 categorías fijas sembradas por la migración inicial.
3. Registro de **≥ 40 libros** con títulos reales, autores, ISBN válidos de 13 dígitos y copias en las 5 categorías.
4. Registro de **≥ 10 socios** con nombres completos y documentos de identidad únicos.
5. Creación de **≥ 15 préstamos** con 1 a 3 líneas cada uno.
6. Validación de reportes agregados (`/reports/most-borrowed`) y listado de vencidos (`/loans/overdue`).

## Instrucciones de Ejecución

1. Asegurarse de que el backend API esté levantado:
   ```bash
   cd ../api
   php artisan serve
   ```

2. Ejecutar el sembrador:
   ```bash
   cd ../tool
   npm run seed
   # o bien:
   node seeder.js
   ```

## Variables de Entorno Opcionales

- `API_URL`: Dirección de la API (por defecto: `http://localhost:8000/api/v1`).
- `ADMIN_USER`: Usuario administrador (por defecto: `admin`).
- `ADMIN_PASS`: Contraseña de administrador (por defecto: `AdminPassword123!`).
