/**
 * @file cultivo.selenium.test.js
 * @description Pruebas end-to-end para el módulo de Cultivos.
 * Valida el CRUD completo y las restricciones de validación del formulario.
 * Ejecuta en Chrome headless con Selenium WebDriver.
 */

import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

// Driver compartido entre todos los casos de esta suite
let driver;

// ===========================================================================
// CONFIGURACIÓN
// ===========================================================================

/**
 * Levanta el navegador en modo headless e inyecta el token JWT
 * para omitir el flujo de autenticación.
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

  // Visitar la app antes de escribir en localStorage
  await driver.get("http://localhost:5173");

  // Persistir credenciales en el almacenamiento local del navegador
  await driver.executeScript(`
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1MjAyMjEyMDMyMTZAdXNjby5lZHUuY28iLCJyb2wiOiJBRE1JTiIsImlhdCI6MTc3OTk1NDMzNywiZXhwIjoxNzgwMDQwNzM3fQ.pqd2xtBfmMSM82EP4vkH9sB0J8QxMLuNHMlqBZlCRVA");
  `);

  // Recargar para que React lea el token recién escrito
  await driver.navigate().refresh();
}

/**
 * Destruye la sesión del navegador al terminar la suite.
 * @async
 */
async function teardown() {
  await driver.quit();
}

// ===========================================================================
// CASOS DE PRUEBA
// ===========================================================================

/**
 * TC-CUL-01: Creación exitosa de un cultivo.
 * Rellena todos los campos del formulario, selecciona el tipo de cultivo
 * mediante el autocomplete y verifica el snackbar de éxito.
 * @async
 */
async function testCrearCultivo() {
  await driver.get("http://localhost:5173/cultivo-form");

  // Esperar a que el primer campo esté disponible antes de interactuar
  await driver.wait(
    until.elementLocated(By.css("[data-testid='cultivo-nombre-input']")),
    10000,
  );

  // -- Campos de texto --
  await driver
    .findElement(By.css("[data-testid='cultivo-nombre-input']"))
    .sendKeys("Maiz Selenium");

  await driver
    .findElement(By.css("[data-testid='cultivo-descripcion-input']"))
    .sendKeys("Cultivo prueba");

  await driver
    .findElement(By.css("[data-testid='cultivo-fechaSiembra-input']"))
    .sendKeys("01-05-2026");

  await driver
    .findElement(By.css("[data-testid='cultivo-fechaestimadacosecha-input']"))
    .sendKeys("01-05-2026");

  await driver
    .findElement(By.css("[data-testid='cultivo-fechacosecha-input']"))
    .sendKeys("01-05-2026");

  await driver
    .findElement(By.css("[data-testid='cultivo-areasembrada-input']"))
    .sendKeys("10");

  await driver
    .findElement(By.css("[data-testid='cultivo-cantidadsiembra-input']"))
    .sendKeys("100");

  await driver
    .findElement(By.css("[data-testid='cultivo-rendestimado-input']"))
    .sendKeys("500");

  await driver
    .findElement(By.css("[data-testid='cultivo-estado-input']"))
    .sendKeys("Activo");

  // -- Selección de tipo de cultivo --
  const selectWrapper = await driver.findElement(
    By.css("[data-testid='cultivo-tipocultivo-select']"),
  );
  const combo = await selectWrapper.findElement(By.css("[role='combobox']"));
  await combo.click();

  const option = await driver.wait(
    until.elementLocated(By.xpath("//li[contains(.,'Tuberculos')]")),
    5000,
  );
  await option.click();

  // Enviar y verificar éxito
  await driver.findElement(By.css("[data-testid='cultivo-guardar-btn']")).click();

  const snackbar = await driver.wait(
    until.elementLocated(By.css("[data-testid='success-snackbar']")),
    10000,
  );
  console.log("🟢 CREATE:", await snackbar.getText());
}

/**
 * TC-CUL-02: Intento de guardado con formulario vacío.
 * Confirma que las reglas de validación impidan el envío
 * y muestren al menos un mensaje de error.
 * @async
 */
async function testCrearCultivoCamposVacios() {
  await driver.get("http://localhost:5173/cultivo-form");

  // Pulsar guardar sin rellenar ningún campo
  await driver.findElement(By.css("[data-testid='cultivo-guardar-btn']")).click();

  // Debe aparecer mensaje de campo obligatorio
  const nombreError = await driver.wait(
    until.elementLocated(
      By.xpath(
        "//*[contains(text(),'obligatorio') or contains(text(),'required')]",
      ),
    ),
    5000,
  );
  console.log("🔴 VALIDACIÓN CAMPOS VACÍOS OK:", await nombreError.getText());
}

/**
 * TC-CUL-03: Listado de cultivos registrados.
 * Navega al tab de Cultivos y cuenta las filas presentes en la tabla.
 * @async
 */
async function testListarCultivo() {
  await driver.get("http://localhost:5173/informacionEntidades");

  // Tab índice 1 corresponde a Cultivos
  const tabs = await driver.findElements(By.css(".MuiTab-root"));
  await tabs[1].click();

  const rows = await driver.wait(
    until.elementsLocated(By.css("tbody tr")),
    10000,
  );
  console.log("📋 CULTIVOS:", rows.length);
}

/**
 * TC-CUL-04: Modificación del primer cultivo en la lista.
 * Abre el formulario de edición, reemplaza el nombre
 * y confirma el snackbar de actualización.
 * @async
 */
async function testActualizarCultivo() {
  await driver.get("http://localhost:5173/informacionEntidades");

  const tabs = await driver.findElements(By.css(".MuiTab-root"));
  await tabs[1].click();

  // Localizar y pulsar el primer botón de edición
  const editBtn = await driver.wait(
    until.elementLocated(By.css("[data-testid^='edit-btn-']")),
    10000,
  );
  await editBtn.click();

  // Esperar a que el campo nombre esté disponible y modificarlo
  const nombre = await driver.wait(
    until.elementLocated(By.css("[data-testid='cultivo-nombre-input']")),
    10000,
  );
  await nombre.clear();
  await nombre.sendKeys("EDITADO CULTIVO SELENIUM");

  await driver.findElement(By.css("[data-testid='cultivo-guardar-btn']")).click();

  const snackbar = await driver.wait(
    until.elementLocated(By.css("[data-testid='success-snackbar']")),
    30000,
  );
  console.log("✏️ UPDATE:", await snackbar.getText());
}

/**
 * TC-CUL-05: Eliminación del primer cultivo de la lista.
 * Acepta el diálogo de confirmación y verifica el conteo
 * de filas resultante.
 * @async
 */
async function testEliminarCultivo() {
  await driver.get("http://localhost:5173/informacionEntidades");

  const tabs = await driver.findElements(By.css(".MuiTab-root"));
  await tabs[1].click();

  const deleteBtn = await driver.wait(
    until.elementLocated(By.css("[data-testid^='delete-btn-']")),
    10000,
  );
  await deleteBtn.click();

  // Confirmar el alert nativo del navegador
  await driver.switchTo().alert().accept();

  // Pausa para que la tabla refleje el cambio
  await driver.sleep(2000);

  const rows = await driver.findElements(By.css("tbody tr"));
  console.log("🗑 DESPUÉS DELETE:", rows.length);
}

// ===========================================================================
// RUNNER
// ===========================================================================

/**
 * Ejecuta la suite completa en orden:
 * crear → validar → listar → actualizar → eliminar.
 */
(async function run() {
  await setup();

  try {
    console.log("==== INICIO CULTIVO TESTS ====");

    await testCrearCultivo();
    await testCrearCultivoCamposVacios();
    await testListarCultivo();
    await testActualizarCultivo();
    await testEliminarCultivo();

    console.log("🎉 TODAS LAS PRUEBAS CULTIVO OK");
  } catch (error) {
    console.error("❌ ERROR SUITE CULTIVO:", error);
  } finally {
    await teardown();
  }
})();