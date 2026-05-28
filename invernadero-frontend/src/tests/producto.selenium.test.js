/**
 * @file producto.selenium.test.js
 * @description Suite end-to-end para el módulo de Productos.
 * Valida el CRUD completo: creación con selects encadenados, bloqueo por
 * campos vacíos, listado, actualización y eliminación.
 * Ejecuta en Chrome headless con Selenium WebDriver.
 */

import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

// Instancia de WebDriver compartida entre los casos de prueba
let driver;

// ===========================================================================
// CONFIGURACIÓN
// ===========================================================================

/**
 * Arranca Chrome en modo headless e inyecta el JWT en localStorage
 * para evitar pasar por el flujo de login.
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

  // Cargar la app para que el dominio esté disponible antes de tocar storage
  await driver.get("http://localhost:4173");

  // Inyectar token de sesión de administrador
  await driver.executeScript(`
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1MjAyMjEyMDMyMTZAdXNjby5lZHUuY28iLCJyb2wiOiJBRE1JTiIsImlhdCI6MTc3OTk1NDMzNywiZXhwIjoxNzgwMDQwNzM3fQ.pqd2xtBfmMSM82EP4vkH9sB0J8QxMLuNHMlqBZlCRVA");
  `);

  // Recargar para que la app inicialice con el token activo
  await driver.navigate().refresh();
}

/**
 * Cierra el navegador al terminar la suite.
 * @async
 */
async function teardown() {
  await driver.quit();
}

// ===========================================================================
// CASOS DE PRUEBA
// ===========================================================================

/**
 * TC-PRD-01: Creación de un producto completo.
 * Selecciona cultivo y unidad de medida mediante autocompletes,
 * rellena los campos numéricos y de texto, y verifica el snackbar de éxito.
 * @async
 */
async function testCrearProducto() {
  await driver.get("http://localhost:4173/producto-form");

  // Esperar que el formulario esté completamente montado
  await driver.wait(
    until.elementLocated(By.css("[data-testid='producto-nombre-input']")),
    10000,
  );

  // -- Autocomplete: cultivo asociado --
  const cultivoWrapper = await driver.findElement(
    By.css("[data-testid='producto-cultivo-select']"),
  );
  const cultivoCombo = await cultivoWrapper.findElement(
    By.css("[role='combobox']"),
  );
  await cultivoCombo.click();

  const cultivoOption = await driver.wait(
    until.elementLocated(By.xpath("//li[contains(.,'Finca')]")),
    5000,
  );
  await cultivoOption.click();

  // -- Campos de texto y numéricos --
  await driver
    .findElement(By.css("[data-testid='producto-nombre-input']"))
    .sendKeys("Producto Selenium");

  await driver
    .findElement(By.css("[data-testid='producto-descripcion-input']"))
    .sendKeys("Descripcion producto selenium");

  await driver
    .findElement(By.css("[data-testid='producto-precio-input']"))
    .sendKeys("15000");

  // -- Autocomplete: unidad de medida --
  const unidadWrapper = await driver.findElement(
    By.css("[data-testid='producto-unidad-select']"),
  );
  const unidadCombo = await unidadWrapper.findElement(
    By.css("[role='combobox']"),
  );
  await unidadCombo.click();

  const unidadOption = await driver.wait(
    until.elementLocated(By.xpath("//li[contains(.,'Kilogramo')]")),
    5000,
  );
  await unidadOption.click();

  // -- Resto de campos --
  await driver
    .findElement(By.css("[data-testid='producto-stockactual-input']"))
    .sendKeys("50");

  await driver
    .findElement(By.css("[data-testid='producto-stockminimo-input']"))
    .sendKeys("10");

  await driver
    .findElement(By.css("[data-testid='producto-categoria-input']"))
    .sendKeys("Verdura Premium");

  await driver
    .findElement(By.css("[data-testid='producto-fechacosecha-input']"))
    .sendKeys("01-05-2026");

  await driver
    .findElement(By.css("[data-testid='producto-fechavencimiento-input']"))
    .sendKeys("10-05-2026");

  // Guardar y esperar confirmación
  await driver.findElement(By.css("[data-testid='producto-guardar-btn']")).click();

  const snackbar = await driver.wait(
    until.elementLocated(By.css("[data-testid='success-snackbar']")),
    10000,
  );
  console.log("🟢 CREATE:", await snackbar.getText());
}

/**
 * TC-PRD-02: Envío del formulario sin datos.
 * Verifica que la validación bloquee el guardado y muestre
 * al menos un mensaje de campo requerido.
 * @async
 */
async function testCrearProductoCamposVacios() {
  await driver.get("http://localhost:4173/producto-form");

  // Intentar guardar con el formulario vacío
  await driver.findElement(By.css("[data-testid='producto-guardar-btn']")).click();

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
 * TC-PRD-03: Listado de productos en tabla.
 * Navega al tab de Productos y registra la cantidad de filas.
 * @async
 */
async function testListarProducto() {
  await driver.get("http://localhost:4173/informacionEntidades");

  // Tab índice 2 corresponde a Productos
  const tabs = await driver.findElements(By.css(".MuiTab-root"));
  await tabs[2].click();

  const rows = await driver.wait(
    until.elementsLocated(By.css("tbody tr")),
    30000,
  );
  console.log("📋 PRODUCTOS:", rows.length);
}

/**
 * TC-PRD-04: Edición del primer producto de la lista.
 * Abre el formulario de edición, modifica el nombre
 * y confirma el snackbar de actualización.
 * @async
 */
async function testActualizarProducto() {
  await driver.get("http://localhost:4173/informacionEntidades");

  const tabs = await driver.findElements(By.css(".MuiTab-root"));
  await tabs[2].click();

  // Esperar y pulsar el primer botón de edición disponible
  const editBtn = await driver.wait(
    until.elementLocated(By.css("[data-testid^='edit-btn-']")),
    10000,
  );
  await editBtn.click();

  const nombre = await driver.wait(
    until.elementLocated(By.css("[data-testid='producto-nombre-input']")),
    10000,
  );
  await nombre.clear();
  await nombre.sendKeys("EDITADO PRODUCTO SELENIUM");

  await driver.findElement(By.css("[data-testid='producto-guardar-btn']")).click();

  const snackbar = await driver.wait(
    until.elementLocated(By.css("[data-testid='success-snackbar']")),
    30000,
  );
  console.log("✏️ UPDATE:", await snackbar.getText());
}

/**
 * TC-PRD-05: Eliminación del primer producto de la lista.
 * Pulsa el botón de borrado, acepta la confirmación nativa
 * y verifica el nuevo conteo de filas.
 * @async
 */
async function testEliminarProducto() {
  await driver.get("http://localhost:4173/informacionEntidades");

  const tabs = await driver.findElements(By.css(".MuiTab-root"));
  await tabs[2].click();

  const deleteBtn = await driver.wait(
    until.elementLocated(By.css("[data-testid^='delete-btn-']")),
    10000,
  );
  await deleteBtn.click();

  // Aceptar el confirm del navegador
  await driver.switchTo().alert().accept();

  // Pausa para que la tabla refleje la eliminación
  await driver.sleep(2000);

  const rows = await driver.findElements(By.css("tbody tr"));
  console.log("🗑 DESPUÉS DELETE:", rows.length);
}

// ===========================================================================
// RUNNER
// ===========================================================================

/**
 * Punto de entrada. Ejecuta los casos en orden:
 * crear → validar → listar → actualizar → eliminar.
 */
(async function run() {
  await setup();

  try {
    console.log("==== INICIO PRODUCTO TESTS ====");

    await testCrearProducto();
    await testCrearProductoCamposVacios();
    await testListarProducto();
    await testActualizarProducto();
    await testEliminarProducto();

    console.log("🎉 TODAS LAS PRUEBAS PRODUCTO OK");
  } catch (error) {
    console.error("❌ ERROR SUITE PRODUCTO:", error);
  } finally {
    await teardown();
  }
})();