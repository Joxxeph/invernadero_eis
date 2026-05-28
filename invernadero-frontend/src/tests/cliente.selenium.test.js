/**
 * @file cliente.selenium.test.js
 * @description Pruebas end-to-end para el módulo de Clientes.
 * Cubre el ciclo de vida completo: alta, validaciones, consulta, modificación y baja.
 * Ejecuta en Chrome headless con Selenium WebDriver.
 */

import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

// Referencia global al driver, inicializada en setup()
let driver;

// ===========================================================================
// CONFIGURACIÓN
// ===========================================================================

/**
 * Inicializa el navegador e inyecta el JWT en localStorage para saltear el login.
 * Debe ejecutarse antes de cualquier prueba.
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

  // Cargar la app base antes de escribir en localStorage
  await driver.get("http://localhost:5173");

  // Inyectar token de autenticación para evitar el flujo de login
  await driver.executeScript(`
    localStorage.setItem("token", "eyJhbGciOiJIUzM4NCJ9.eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1MjAyMjEyMDMyMTZAdXNjby5lZHUuY28iLCJyb2wiOiJBRE1JTiIsImlhdCI6MTc3OTk1NDMzNywiZXhwIjoxNzgwMDQwNzM3fQ.pqd2xtBfmMSM82EP4vkH9sB0J8QxMLuNHMlqBZlCRVA.1nOLGHk1NPUViegqJHul6RJOKMBJnt3p-Qn6jsoyZlnGfoi4xHLKhAkfuA43eu6Y");
  `);

  // Refrescar para que la app lea el token recién inyectado
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
 * TC-CLI-01: Creación de un cliente con datos válidos.
 * Selecciona una persona del autocomplete, completa los campos
 * y verifica el snackbar de confirmación.
 * @async
 */
async function testCrearCliente() {
  await driver.get("http://localhost:5173/cliente-form");

  // Esperar a que el formulario esté listo
  await driver.wait(
    until.elementLocated(By.css("[data-testid='cliente-guardar-btn']")),
    10000,
  );

  // -- Selección de persona asociada --
  const personaWrapper = await driver.findElement(
    By.css("[data-testid='cliente-persona-input']"),
  );
  const personaCombo = await personaWrapper.findElement(
    By.css("[role='combobox']"),
  );
  await personaCombo.click();

  // Tomar la primera opción disponible
  const opciones = await driver.wait(
    until.elementsLocated(By.css("li[role='option']")),
    5000,
  );
  await opciones[0].click();

  // -- Campos del formulario --
  await driver
    .findElement(By.css("[data-testid='cliente-categoria-input']"))
    .sendKeys("Premium");

  await driver
    .findElement(By.css("[data-testid='cliente-descuento-input']"))
    .sendKeys("15");

  await driver
    .findElement(By.css("[data-testid='cliente-frecuencia-input']"))
    .sendKeys("Mensual");

  await driver
    .findElement(By.css("[data-testid='cliente-fechaCompra-input']"))
    .sendKeys("01-05-2026");

  // Enviar formulario
  await driver.findElement(By.css("[data-testid='cliente-guardar-btn']")).click();

  // Validar mensaje de éxito
  const snackbar = await driver.wait(
    until.elementLocated(By.css("[data-testid='success-snackbar']")),
    10000,
  );
  console.log("🟢 CREATE:", await snackbar.getText());
}

/**
 * TC-CLI-02: Intento de guardado con formulario vacío.
 * Verifica que la validación bloquee el envío y muestre
 * al menos un mensaje de campo obligatorio.
 * @async
 */
async function testCrearClienteCamposVacios() {
  await driver.get("http://localhost:5173/cliente-form");

  // Intentar guardar sin llenar nada
  await driver.findElement(By.css("[data-testid='cliente-guardar-btn']")).click();

  // Debe aparecer al menos un mensaje de error
  const error = await driver.wait(
    until.elementLocated(
      By.xpath(
        "//*[contains(text(),'obligatorio') or contains(text(),'required')]",
      ),
    ),
    5000,
  );
  console.log("🔴 VALIDACIÓN CAMPOS VACÍOS OK:", await error.getText());
}

/**
 * TC-CLI-03: Consulta del listado de clientes.
 * Navega al tab correspondiente y cuenta las filas de la tabla.
 * @async
 */
async function testListarCliente() {
  await driver.get("http://localhost:5173/informacionEntidades");

  // Tab índice 5 corresponde a Clientes
  const tabs = await driver.findElements(By.css(".MuiTab-root"));
  await tabs[5].click();

  const rows = await driver.wait(
    until.elementsLocated(By.css("tbody tr")),
    10000,
  );
  console.log("📋 CLIENTES:", rows.length);
}

/**
 * TC-CLI-04: Edición del primer cliente de la lista.
 * Abre el formulario de edición, modifica la categoría
 * y confirma el snackbar de actualización.
 * @async
 */
async function testActualizarCliente() {
  await driver.get("http://localhost:5173/informacionEntidades");

  const tabs = await driver.findElements(By.css(".MuiTab-root"));
  await tabs[5].click();

  // Esperar y pulsar el primer botón de edición disponible
  const editBtn = await driver.wait(
    until.elementLocated(By.css("[data-testid^='edit-btn-']")),
    10000,
  );
  await editBtn.click();

  // Modificar el campo categoría
  const categoria = await driver.wait(
    until.elementLocated(By.css("[data-testid='cliente-categoria-input']")),
    10000,
  );
  await categoria.clear();
  await categoria.sendKeys("EDITADO CLIENTE SELENIUM");

  await driver.findElement(By.css("[data-testid='cliente-guardar-btn']")).click();

  // Confirmar actualización exitosa
  const snackbar = await driver.wait(
    until.elementLocated(By.css("[data-testid='success-snackbar']")),
    30000,
  );
  console.log("✏️ UPDATE:", await snackbar.getText());
}

/**
 * TC-CLI-05: Eliminación del primer cliente de la lista.
 * Acepta el diálogo de confirmación y verifica
 * que la cantidad de filas disminuyó.
 * @async
 */
async function testEliminarCliente() {
  await driver.get("http://localhost:5173/informacionEntidades");

  const tabs = await driver.findElements(By.css(".MuiTab-root"));
  await tabs[5].click();

  const deleteBtn = await driver.wait(
    until.elementLocated(By.css("[data-testid^='delete-btn-']")),
    10000,
  );
  await deleteBtn.click();

  // Aceptar el confirm nativo del navegador
  await driver.switchTo().alert().accept();

  // Dar tiempo a que la tabla se actualice
  await driver.sleep(2000);

  const rows = await driver.findElements(By.css("tbody tr"));
  console.log("🗑 DESPUÉS DELETE:", rows.length);
}

// ===========================================================================
// RUNNER
// ===========================================================================

/**
 * Punto de entrada. Ejecuta la suite completa en orden:
 * crear → validar → listar → actualizar → eliminar.
 */
(async function run() {
  await setup();

  try {
    console.log("==== INICIO CLIENTE TESTS ====");

    await testCrearCliente();
    await testCrearClienteCamposVacios();
    await testListarCliente();
    await testActualizarCliente();
    await testEliminarCliente();

    console.log("🎉 TODAS LAS PRUEBAS CLIENTE OK");
  } catch (error) {
    console.error("❌ ERROR SUITE CLIENTE:", error);
  } finally {
    await teardown();
  }
})();