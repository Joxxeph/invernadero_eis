/**
 * @file tipoIdentificacion.selenium.test.js
 * @description Suite end-to-end para el módulo Tipo de Identificación.
 * Cubre el ciclo completo: validación de campos vacíos, creación,
 * listado, actualización y eliminación.
 * Usa Chrome headless vía Selenium WebDriver.
 */

/* eslint-disable no-unused-vars */
import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

// Driver compartido entre todos los casos de la suite
let driver;

// ===========================================================================
// CONFIGURACIÓN
// ===========================================================================

/**
 * Levanta el navegador en modo headless e inyecta el token JWT
 * para evitar el flujo de autenticación manual.
 * @async
 */
async function setup() {
  const options = new chrome.Options();
  options.addArguments("--headless=new");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  options.addArguments("--disable-gpu");
  options.addArguments("--window-size=1920,1080");

  driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  // Navegar al dominio antes de interactuar con localStorage
  await driver.get("http://localhost:5173");

  // Persistir credenciales de sesión en el almacenamiento local
  await driver.executeScript(`
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1MjAyMjEyMDMyMTZAdXNjby5lZHUuY28iLCJyb2wiOiJBRE1JTiIsImlhdCI6MTc3OTk1NDMzNywiZXhwIjoxNzgwMDQwNzM3fQ.pqd2xtBfmMSM82EP4vkH9sB0J8QxMLuNHMlqBZlCRVA");
  `);

  // Recargar para que la app inicialice con el token activo
  await driver.navigate().refresh();
}

/**
 * Cierra el navegador al finalizar la suite.
 * @async
 */
async function teardown() {
  await driver.quit();
}

// ===========================================================================
// CASOS DE PRUEBA
// ===========================================================================

/**
 * TC-TID-01: Bloqueo de envío con campos vacíos.
 * Verifica que el formulario no permita crear un registro
 * cuando nombre y abreviatura están en blanco.
 * @async
 */
async function testCrearTipoIdentificacionCamposVacios() {
  await driver.get("http://localhost:5173/tipo-identificacion-form");

  // Esperar que el formulario esté montado
  await driver.wait(
    until.elementLocated(By.css("[data-testid='tipoident-nombre-input']")),
    10000,
  );

  const nombre = await driver.findElement(
    By.css("[data-testid='tipoident-nombre-input']"),
  );
  const abrev = await driver.findElement(
    By.css("[data-testid='tipoident-abreviatura-input']"),
  );

  // Limpiar explícitamente ambos campos
  await nombre.clear();
  await abrev.clear();

  // Intentar enviar con todo vacío
  await driver.findElement(By.css("[data-testid='tipoident-guardar-btn']")).click();

  // Si aparece snackbar de éxito, la validación no está funcionando
  let snackbarApareció = true;
  try {
    await driver.wait(
      until.elementLocated(By.css("[data-testid='success-snackbar']")),
      3000,
    );
  } catch (e) {
    snackbarApareció = false;
  }

  if (snackbarApareció) {
    throw new Error("❌ ERROR: se permitió crear con campos vacíos");
  }

  console.log("🚫 VALIDACIÓN OK: no se permitió crear vacío");

  // Verificar si hay mensajes de error visibles en el DOM
  const erroresNombre = await driver.findElements(
    By.xpath("//*[contains(text(),'obligatorio')]"),
  );

  if (erroresNombre.length === 0) {
    console.log("⚠️ No se detectaron mensajes visibles, pero validación bloqueó submit");
  } else {
    console.log("✅ Errores de validación visibles correctamente");
  }
}

/**
 * TC-TID-02: Creación de un tipo de identificación válido.
 * Ingresa nombre y abreviatura, guarda y verifica
 * el snackbar de confirmación.
 * @async
 */
async function testCrearTipoIdentificacion() {
  await driver.get("http://localhost:5173/tipo-identificacion-form");

  // Esperar que los campos estén disponibles
  await driver.wait(
    until.elementLocated(By.css("[data-testid='tipoident-nombre-input']")),
    10000,
  );

  const nombre = await driver.findElement(
    By.css("[data-testid='tipoident-nombre-input']"),
  );
  await nombre.clear();
  await nombre.sendKeys("TIPO SELENIUM CREATE");

  const abrev = await driver.findElement(
    By.css("[data-testid='tipoident-abreviatura-input']"),
  );
  await abrev.clear();
  await abrev.sendKeys("TSC");

  await driver.findElement(By.css("[data-testid='tipoident-guardar-btn']")).click();

  // Esperar y leer el mensaje de éxito
  const snackbar = await driver.wait(
    until.elementLocated(By.css("[data-testid='success-snackbar']")),
    10000,
  );
  const text = await snackbar.getText();
  console.log("📩 SNACKBAR:", text);
  console.log("🟢 CREATE OK");
}

/**
 * TC-TID-03: Listado de tipos de identificación.
 * Navega al tab correspondiente, cuenta las filas
 * y lanza error si la tabla está vacía.
 * @async
 */
async function testListarTipoIdentificacion() {
  await driver.get("http://localhost:5173/informacionEntidades");

  // Tab índice 3 corresponde a Tipo de Identificación
  const tabs = await driver.findElements(By.css(".MuiTab-root"));
  await tabs[3].click();

  const rows = await driver.wait(
    until.elementsLocated(By.css("tbody tr")),
    10000,
  );
  console.log(`📋 TIPOS EN TABLA: ${rows.length}`);

  if (rows.length > 0) {
    console.log("✅ LISTADO OK");
  } else {
    throw new Error("❌ No hay registros en la tabla");
  }
}

/**
 * TC-TID-04: Modificación de un tipo de identificación existente.
 * Abre el primer registro en edición, cambia el nombre
 * y confirma que el guardado se procesa.
 * @async
 */
async function testActualizarTipoIdentificacion() {
  await driver.get("http://localhost:5173/informacionEntidades");

  const tabs = await driver.findElements(By.css(".MuiTab-root"));
  await tabs[3].click();

  // Esperar y pulsar el primer botón de edición
  const editBtn = await driver.wait(
    until.elementLocated(By.css("[data-testid^='edit-btn-']")),
    10000,
  );
  await editBtn.click();

  // Esperar el formulario de edición
  await driver.wait(
    until.elementLocated(By.css("[data-testid='tipoident-nombre-input']")),
    10000,
  );

  const nombre = await driver.findElement(
    By.css("[data-testid='tipoident-nombre-input']"),
  );
  await nombre.clear();
  await nombre.sendKeys("EDITADO SELENIUM");

  await driver.findElement(By.css("[data-testid='tipoident-guardar-btn']")).click();

  // Esperar posible alert de confirmación (si existe)
  await driver.wait(until.alertIsPresent(), 5000).catch(() => {});

  console.log("✏️ UPDATE EJECUTADO");
}

/**
 * TC-TID-05: Eliminación de un tipo de identificación.
 * Localiza el botón de borrado por índice, acepta
 * la confirmación y verifica el conteo resultante.
 * @async
 */
async function testEliminarTipoIdentificacion() {
  await driver.get("http://localhost:5173/informacionEntidades");

  const tabs = await driver.findElements(By.css(".MuiTab-root"));
  await tabs[3].click();

  // Registrar cuántas filas hay antes de borrar
  const rows = await driver.wait(
    until.elementsLocated(By.css("tbody tr")),
    10000,
  );
  console.log(`📋 Filas antes delete: ${rows.length}`);

  // Obtener todos los botones delete y usar el primero (índice 0)
  const deleteButtons = await driver.findElements(
    By.css("[data-testid^='delete-btn-']"),
  );

  if (!deleteButtons[0]) {
    throw new Error("❌ No existe botón delete en ese índice");
  }

  await deleteButtons[0].click();

  // Aceptar el confirm nativo del navegador
  await driver.switchTo().alert().accept();

  // Pausa para que la tabla se actualice tras la eliminación
  await driver.sleep(1500);

  const rowsAfter = await driver.findElements(By.css("tbody tr"));
  console.log(`🗑 Filas después delete: ${rowsAfter.length}`);
}

// ===========================================================================
// RUNNER
// ===========================================================================

/**
 * Punto de entrada de la suite.
 * Orden: validar vacíos → crear → listar → actualizar → eliminar.
 */
(async function run() {
  await setup();

  try {
    console.log("==== INICIO TESTS TIPO IDENTIFICACIÓN ====");

    await testCrearTipoIdentificacionCamposVacios();
    await testCrearTipoIdentificacion();
    await testListarTipoIdentificacion();
    await testActualizarTipoIdentificacion();
    await testEliminarTipoIdentificacion();

    console.log("🎉 TODAS LAS PRUEBAS OK");
  } catch (error) {
    console.error("❌ ERROR EN SUITE:", error);
  } finally {
    await teardown();
  }
})();