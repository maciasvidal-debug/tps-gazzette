# Diseño Arquitectónico: Módulo de Encuesta Interactiva (Interactive Poll)

## 1. ARQUITECTURA DEL DOMINIO

El objetivo es introducir un módulo de **Encuesta Interactiva (Interactive Poll)** dentro del sistema de maquetación de newsletters. Dado que los clientes de correo son altamente restrictivos (como Outlook en escritorio), no podemos depender de JavaScript interactivo ni de formularios HTML completos (`<form>`) que funcionen uniformemente en el cliente de correo final.

Por lo tanto, la interacción debe resolverse a través de enlaces con parámetros GET en los botones de votación. Estos enlaces apuntarán a un endpoint (o sistema externo de recolección de votos) y pueden dirigir al usuario a una página de agradecimiento.

### Integración con el Motor Actual:
- **Acoplamiento débil:** Se extiende la interfaz del estado inmutable (`GazzetteState`) con un nuevo nodo `poll` de tipo `PollState` totalmente desacoplado y opcional, sin interferir con las secciones existentes.
- **Renderizado idempotente:** La generación HTML (Inline) del bloque será estática (botones de llamada a la acción estilizados con CSS seguro de tablas y VML si fuera necesario para Outlook, o simplemente componentes anidados en tablas) que mapearán las respuestas. La serialización al exportar en el WYSIWYG se garantizará consistente mediante el uso de la arquitectura existente (React a HTML inline).

## 2. ESPECIFICACIÓN DE ARCHIVOS (Árbol de Componentes/Módulos)

Se añadirán/modificarán los siguientes archivos siguiendo el principio de responsabilidad única (Single Responsibility Principle):

* **`src/types/gazzette.ts`** (Modificado)
  * Responsabilidad: Extender la interfaz `GazzetteState` incluyendo `poll?: PollState;` y definir la interfaz `PollState` (con propiedades como `question`, `options`, `endpoint`).

* **`src/components/editor/blocks/PollBlock.tsx`** (Nuevo)
  * Responsabilidad: Componente de renderizado de la encuesta en el canvas del newsletter. Generará el HTML seguro para emails utilizando tablas para asegurar la compatibilidad con clientes de correo restrictivos.

* **`src/components/editor/sidebar/PollConfigPanel.tsx`** (Nuevo)
  * Responsabilidad: Interfaz de usuario WYSIWYG (dentro de `EditorSidebar`) para que el editor configure la pregunta, las opciones, y el link de recolección (endpoint) de la encuesta. Integración con `useGazzetteState`.

* **`src/utils/pollSanitizer.ts`** (Nuevo)
  * Responsabilidad: Función pura encargada de validar y limpiar los inputs del estado de la encuesta (especialmente la URL del endpoint usando `validateUrl` para prevenir XSS) antes de renderizar, asegurando Idempotencia.

* **`src/components/editor/EditorSidebar.tsx`** (Modificado)
  * Responsabilidad: Inyectar `PollConfigPanel` en la barra lateral para habilitar su edición si se activa el módulo.

* **`src/components/GazzettePreview.tsx`** (Modificado)
  * Responsabilidad: Incluir la importación y renderizado condicional de `PollBlock` dentro del flujo de maquetación actual.

* **`tests/components/PollBlock.test.tsx`** (Nuevo)
  * Responsabilidad: Pruebas unitarias aislando el renderizado de `PollBlock` y verificando la pureza de sus props y su estructura HTML de salida (sin scripts).

## 3. ESTRATEGIA DE IMPLEMENTACIÓN (Paso a Paso)

Para asegurar cero regresiones (Backward Compatibility) y una evolución segura, la implementación se ejecutará en los siguientes pasos atómicos:

1. **Paso Atómico 1: Extensión de Tipos (Domain Layer)**
   * Actualizar `src/types/gazzette.ts`.
   * *Verificación:* Ejecutar validación de tipos (`tsc`) para confirmar que el añadir una propiedad opcional `poll?` no rompe ningún estado base existente (los drafts previos lo leerán como `undefined`).

2. **Paso Atómico 2: Desarrollo del Util de Sanitización (Utility Layer)**
   * Crear `src/utils/pollSanitizer.ts`.
   * *Verificación:* Crear y correr pruebas unitarias con Bun para validar que URLs maliciosas (ej. `javascript:`) sean purgadas y el texto de las preguntas/opciones sanitizado.

3. **Paso Atómico 3: Desarrollo del Componente de Renderizado (Presentation Layer)**
   * Crear `src/components/editor/blocks/PollBlock.tsx`.
   * Utilizar estructuras de tablas seguras (`<table role="presentation">`) y no usar JavaScript del lado del cliente en el render final.
   * *Verificación:* Renderizar en un entorno de pruebas comprobando la salida HTML.

4. **Paso Atómico 4: Desarrollo de la Interfaz de Edición (Editor Layer)**
   * Crear `src/components/editor/sidebar/PollConfigPanel.tsx` usando componentes estándar (`FormInput`, `FormTextArea` de `FormElements.tsx`).
   * *Verificación:* Comprobar la correcta mutación del clon en draft usando `useGazzetteState` e integridad del guardado en `localStorage`.

5. **Paso Atómico 5: Integración (Orchestration Layer)**
   * Modificar `EditorSidebar.tsx` y `GazzettePreview.tsx` para ensamblar el módulo final de forma condicional, activable mediante `PollState`.
   * *Verificación:* Test de regresión visual y funcional end-to-end (Playwright) para confirmar que la app sin encuestas sigue operando intacta.

## 4. PROTOCOLO DE VALIDACIÓN TQM

Para asegurar el **Technical Compliance** y la alineación con Quality by Design, el módulo debe superar los siguientes portales de calidad (Quality Gates):

* **Gate 1: Pruebas Unitarias de Aislamiento (Unit Testing)**
  * **Criterio:** La función de renderizado y el hook de estado asociado al `PollState` no deben presentar efectos colaterales (pureza del componente).
  * **Test:** Cobertura > 90% en `pollSanitizer.ts` y tests de mutación de estado con `Bun test`.

* **Gate 2: Validación de Renderizado de Email (Email Compliance)**
  * **Criterio:** El HTML resultante generado por `PollBlock` no debe contener etiquetas `<script>`, `<form>`, `<input>`, ni estilos posicionales absolutos. Debe basarse íntegramente en HTML pre-HTML5 y `<table role="presentation">`.
  * **Test:** Análisis estático de la salida HTML (DOMParser) validando la lista de etiquetas permitidas (whitelist).

* **Gate 3: Regresión Cero (Backward Compatibility)**
  * **Criterio:** La introducción de `PollState` no debe invalidar documentos en formato `localStorage` de versiones previas (manejo de estados `undefined`). El Pre-Flight Quality Gate (`validateGazzette` en `qualityMetrics.ts`) no debe bloquear documentos antiguos que carecen del objeto de encuesta.
  * **Test:** Prueba de integración cargando un estado JSON "legacy" sin `poll` verificando que el árbol de renderizado del `GazzettePreview` se monta sin errores (React Error Boundaries no saltan).

* **Gate 4: Idempotencia de Mutaciones**
  * **Criterio:** Guardar idénticos parámetros en `PollConfigPanel` múltiples veces debe generar exactamente el mismo clon de estado en `GazzetteState` (usando `structuredClone()`), sin añadir variaciones o incrementos en la huella de memoria.

---
*Este documento se aprueba y bloquea como diseño base. Cualquier desviación requerirá una revisión de la arquitectura.*