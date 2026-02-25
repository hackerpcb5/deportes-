# TODO: Implementar Modo Administrador para Deportes

## Tareas Pendientes

### 1. Actualizar admin.html
- [ ] Agregar botón de navegación para "Deportes" en el sidebar
- [ ] Crear sección de edición para competencias (fechas, eventos, lugares)
- [ ] Crear sección de edición para resultados
- [ ] Crear sección de edición para directorio de deportes
- [ ] Crear sección de edición para staff técnico

### 2. Actualizar admin.js
- [ ] Agregar configuración para sección "deportes" en SECTIONS
- [ ] Implementar funciones para editar competencias
- [ ] Implementar funciones para editar resultados
- [ ] Implementar funciones para editar directorio de deportes
- [ ] Implementar funciones para editar staff técnico
- [ ] Actualizar renderGallery para manejar deportes

### 3. Actualizar data/content-data.json
- [ ] Agregar estructura inicial para datos de deportes:
  - competencias: array de objetos con fecha, evento, lugar
  - resultados: array de objetos con deporte, resultado
  - deportes: array de objetos con nombre, descripción, estado
  - staff: array de objetos con nombre, rol, descripción

### 4. Actualizar deportes.html
- [ ] Reemplazar contenido hardcodeado con carga dinámica desde content-data.json
- [ ] Agregar script para cargar datos de competencias, resultados, deportes y staff
- [ ] Asegurar que los cambios en admin se reflejen automáticamente

### 5. Testing
- [ ] Verificar que el panel admin cargue la nueva sección
- [ ] Probar edición de cada tipo de contenido
- [ ] Verificar que deportes.html muestre los datos actualizados
- [ ] Probar persistencia de datos en localStorage y JSON
