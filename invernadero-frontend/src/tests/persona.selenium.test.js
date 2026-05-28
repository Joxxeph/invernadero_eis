/**
 * @file persona.selenium.test.js
 * @description Suite de pruebas end-to-end para el módulo Persona.
 * Cubre el ciclo completo: creación con datos válidos, bloqueo por campos vacíos,
 * listado en tabla, actualización y eliminación.
 * Usa Chrome headless vía Selenium WebDriver.
 */

import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

// Driver compartido a lo largo de toda la suite
let driver;

// ===========================================================================
// CONFIGURACIÓN
// ===========================================================================

/**
 * Inicializa Chrome en modo headless e inyecta el token JWT
 * para saltear la pantalla de login.
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

  // Navegar primero para que localStorage esté disponible en el dominio correcto
  await driver.get("http://localhost:4173");

  // Inyectar credenciales de sesión
  await driver.executeScript(`
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1MjAyMjEyMDMyMTZAdXNjby5lZHUuY28iLCJyb2wiOiJBRE1JTiIsImlhdCI6MTc3OTk1NDMzNywiZXhwIjoxNzgwMDQwNzM3fQ.pqd2xtBfmMSM82EP4vkH9sB0J8QxMLuNHMlqBZlCRVA");
  `);

  // Refrescar para que la app procese el token
  await driver.navigate().refresh();
}

/**
 * Cierra el navegador al finalizar todos los casos.
 * @async
 */
async function teardown() {
  await driver.quit();
}

// ===========================================================================
// CASOS DE PRUEBA
// ===========================================================================

/**
 * TC-PER-01: Alta de persona con datos completos.
 * Selecciona el tipo de identificación, completa todos los campos
 * y verifica el snackbar de confirmación.
 * @async
 */
async function testCrearPersona() {
  await driver.get("http://localhost:4173/persona-form");

  // Esperar a que el formulario esté montado
  await driver.wait(
    until.elementLocated(By.css("[data-testid='persona-nombre-input']")),
    10000,
  );

  // -- Autocomplete: tipo de identificación --
  const tipoWrapper = await driver.findElement(
    By.css("[data-testid='persona-tipoIdent-input']"),
  );
  const tipoCombo = await tipoWrapper.findElement(By.css("[role='combobox']"));
  await tipoCombo.click();

  // Seleccionar la primera opción que contenga "de"
  const tipoOption = await driver.wait(
    until.elementLocated(By.xpath("//li[contains(.,'de')]")),
    5000,
  );
  await tipoOption.click();

  // -- Campos del formulario --
  await driver
    .findElement(By.css("[data-testid='persona-ident-input']"))
    .sendKeys("123456789");

  await driver
    .findElement(By.css("[data-testid='persona-nombre-input']"))
    .sendKeys("Maria Selenium");

  await driver
    .findElement(By.css("[data-testid='persona-apellido-input']"))
    .sendKeys("Tester");

  await driver
    .findElement(By.css("[data-testid='persona-email-input']"))
    .sendKeys("selenium@test.com");

  await driver
    .findElement(By.css("[data-testid='persona-telefono-input']"))
    .sendKeys("3001234567");

  await driver
    .findElement(By.css("[data-testid='persona-direccion-input']"))
    .sendKeys("Direccion Selenium");

  // Enviar y comprobar éxito
  await driver.findElement(By.css("[data-testid='persona-guardar-btn']")).click();

  const snackbar = await driver.wait(
    until.elementLocated(By.css("[data-testid='success-snackbar']")),
    10000,
  );
  console.log("🟢 CREATE:", await snackbar.getText());
}

/**
 * TC-PER-02: Envío del formulario sin datos.
 * Verifica que la validación impida el guardado y
 * muestre mensajes de error al usuario.
 * @async
 */
async function testCrearPersonaCamposVacios() {
  await driver.get("http://localhost:4173/persona-form");

  // Intentar guardar con todo vacío
  await driver.findElement(By.css("[data-testid='persona-guardar-btn']")).click();

  // Confirmar que aparece algún mensaje de validación
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
 * TC-PER-03: Visualización del listado de personas.
 * Navega al tab correspondiente y registra cuántas filas hay en la tabla.
 * @async
 */
async function testListarPersona() {
  await driver.get("http://localhost:4173/informacionEntidades");

  // Tab índice 3 corresponde a Persona
  const tabs = await driver.findElements(By.css(".MuiTab-root"));
  await tabs[3].click();

  const rows = await driver.wait(
    until.elementsLocated(By.css("tbody tr")),
    10000,
  );
  console.log("📋 PERSONAS:", rows.length);
}

/**
 * TC-PER-04: Modificación de una persona existente.
 * Abre el primer registro en edición, cambia el nombre
 * y confirma el mensaje de actualización.
 * @async
 */
async function testActualizarPersona() {
  await driver.get("http://localhost:4173/informacionEntidades");

  // Tab índice 4 para personas (puede diferir del listado)
  const tabs = await driver.findElements(By.css(".MuiTab-root"));
  await tabs[4].click();

  const editBtn = await driver.wait(
    until.elementLocated(By.css("[data-testid^='edit-btn-']")),
    10000,
  );
  await editBtn.click();

  // Esperar el formulario de edición y reemplazar el nombre
  const nombre = await driver.wait(
    until.elementLocated(By.css("[data-testid='persona-nombre-input']")),
    10000,
  );
  await nombre.clear();
  await nombre.sendKeys("EDITADO PERSONA SELENIUM");

  await driver.findElement(By.css("[data-testid='persona-guardar-btn']")).click();

  const snackbar = await driver.wait(
    until.elementLocated(By.css("[data-testid='success-snackbar']")),
    30000,
  );
  console.log("✏️ UPDATE:", await snackbar.getText());
}

/**
 * TC-PER-05: Eliminación de una persona.
 * Pulsa el botón de borrado, acepta la confirmación
 * y verifica el nuevo estado de la tabla.
 * @async
 */
async function testEliminarPersona() {
  await driver.get("http://localhost:4173/informacionEntidades");

  const tabs = await driver.findElements(By.css(".MuiTab-root"));
  await tabs[4].click();

  const deleteBtn = await driver.wait(
    until.elementLocated(By.css("[data-testid^='delete-btn-']")),
    10000,
  );
  await deleteBtn.click();

  // Aceptar el confirm nativo del navegador
  await driver.switchTo().alert().accept();

  // Esperar a que la tabla se actualice
  await driver.sleep(2000);

  const rows = await driver.findElements(By.css("tbody tr"));
  console.log("🗑 DESPUÉS DELETE:", rows.length);
}

// ===========================================================================
// RUNNER
// ===========================================================================

/**
 * Punto de entrada de la suite.
 * Orden de ejecución: crear → validar → listar → actualizar → eliminar.
 */
(async function run() {
  await setup();

  try {
    console.log("==== INICIO PERSONA TESTS ====");

    await testCrearPersona();
    await testCrearPersonaCamposVacios();
    await testListarPersona();
    await testActualizarPersona();
    await testEliminarPersona();

    console.log("🎉 TODAS LAS PRUEBAS PERSONA OK");
  } catch (error) {
    console.error("❌ ERROR SUITE PERSONA:", error);
  } finally {
    await teardown();
  }
})();