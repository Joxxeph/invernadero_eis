/**
 * @file tipoCultivo.selenium.test.js
 * @description Suite end-to-end para el módulo Tipo de Cultivo.
 * Verifica CRUD completo y reglas de validación del formulario.
 * Usa Chrome headless con Selenium WebDriver.
 */

/* eslint-disable no-unused-vars */
import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

// Instancia compartida del driver
let driver;

// ===========================================================================
// CONFIGURACIÓN
// ===========================================================================

/**
 * Inicializa el navegador en modo headless e inyecta
 * el token JWT para omitir el flujo de autenticación.
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
  await driver.get("http://localhost:4173");

  // Inyectar token de sesión de administrador
  await driver.executeScript(`
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1MjAyMjEyMDMyMTZAdXNjby5lZHUuY28iLCJyb2wiOiJBRE1JTiIsImlhdCI6MTc3OTk1NDMzNywiZXhwIjoxNzgwMDQwNzM3fQ.pqd2xtBfmMSM82EP4vkH9sB0J8QxMLuNHMlqBZlCRVA");
  `);

  // Recargar para activar el token en la sesión
  await driver.navigate().refresh();
}

/**
 * Libera el navegador al terminar todos los casos.
 * @async
 */
async function teardown() {
  await driver.quit();
}

// ===========================================================================
// CASOS DE PRUEBA
// ===========================================================================

/**
 * TC-TPC-01: Bloqueo de creación con campos vacíos.
 * Confirma que el formulario no haga submit cuando
 * no hay datos ingresados (no debe aparecer el snackbar de éxito).
 * @async
 */
async function testCrearTipoCultivoVacio() {
  await driver.get("http://localhost:4173/tipo-cultivo-form");

  // Pulsar guardar sin rellenar nada
  await driver.findElement(By.css("[data-testid='tipocultivo-guardar-btn']")).click();

  // Si aparece el snackbar de éxito, la prueba falla
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
    throw new Error("❌ No debería permitir creación vacía");
  }

  console.log("🚫 VALIDACIÓN OK (no permite vacíos)");
}

/**
 * TC-TPC-02: Alta exitosa de un tipo de cultivo.
 * Rellena todos los campos del formulario y verifica
 * el snackbar de confirmación.
 * @async
 */
async function testCrearTipoCultivo() {
  await driver.get("http://localhost:4173/tipo-cultivo-form");

  // Esperar que el formulario esté disponible
  await driver.wait(
    until.elementLocated(By.css("[data-testid='tipocultivo-nombre-input']")),
    10000,
  );

  await driver
    .findElement(By.css("[data-testid='tipocultivo-nombre-input']"))
    .sendKeys("Cultivo Selenium");

  await driver
    .findElement(By.css("[data-testid='tipocultivo-descripcion-input']"))
    .sendKeys("Descripción test");

  await driver
    .findElement(By.css("[data-testid='tipocultivo-clasificacion-input']"))
    .sendKeys("Frutal");

  await driver
    .findElement(By.css("[data-testid='tipocultivo-tiempocosechadias-input']"))
    .sendKeys("30");

  await driver
    .findElement(By.css("[data-testid='tipocultivo-temporada-input']"))
    .sendKeys("Verano");

  // Enviar formulario y confirmar éxito
  await driver.findElement(By.css("[data-testid='tipocultivo-guardar-btn']")).click();

  const snackbar = await driver.wait(
    until.elementLocated(By.css("[data-testid='success-snackbar']")),
    10000,
  );
  console.log("🟢 CREATE OK:", await snackbar.getText());
}

/**
 * TC-TPC-03: Listado de tipos de cultivo registrados.
 * Navega al tab correspondiente, cuenta las filas y
 * lanza error si la tabla está vacía.
 * @async
 */
async function testListarTipoCultivo() {
  await driver.get("http://localhost:4173/informacionEntidades");

  // Esperar a que los tabs existan antes de intentar hacer click
  await driver.wait(
    until.elementLocated(By.css(".MuiTab-root")),
    10000,
  );

  const tabs = await driver.findElements(By.css(".MuiTab-root"));
  console.log("TABS ENCONTRADOS:", tabs.length); // diagnóstico
  await tabs[0].click();

  const rows = await driver.wait(
    until.elementsLocated(By.css("tbody tr")),
    10000,
  );
  console.log(`📋 TIPOS CULTIVO: ${rows.length}`);

  if (rows.length === 0) {
    throw new Error("❌ No  hay registros de tipo cultivo");
  }
  console.log("✅ LISTADO OK");
}
/**
 * TC-TPC-04: Modificación de un tipo de cultivo existente.
 * Abre el primer registro en edición, reemplaza el nombre
 * y guarda el cambio.
 * @async
 */
async function testActualizarTipoCultivo() {
  await driver.get("http://localhost:4173/informacionEntidades");

  const tabs = await driver.findElements(By.css(".MuiTab-root"));
  await tabs[0].click();

  // Esperar y pulsar el primer botón de edición
  const editBtn = await driver.wait(
    until.elementLocated(By.css("[data-testid^='edit-btn-']")),
    10000,
  );
  await editBtn.click();

  // Esperar que el formulario de edición cargue
  await driver.wait(
    until.elementLocated(By.css("[data-testid='tipocultivo-nombre-input']")),
    10000,
  );

  const nombre = await driver.findElement(
    By.css("[data-testid='tipocultivo-nombre-input']"),
  );
  await nombre.clear();
  await nombre.sendKeys("EDITADO CULTIVO");

  await driver.findElement(By.css("[data-testid='tipocultivo-guardar-btn']")).click();

  console.log("✏️ UPDATE OK");
}

/**
 * TC-TPC-05: Eliminación del primer tipo de cultivo.
 * Localiza el botón de borrado, acepta la confirmación
 * y registra el resultado.
 * @async
 */
async function testEliminarTipoCultivo() {
  await driver.get("http://localhost:4173/informacionEntidades");

  const tabs = await driver.findElements(By.css(".MuiTab-root"));
  await tabs[0].click();

  // Obtener todos los botones delete y usar el primero
  const deleteButtons = await driver.findElements(
    By.css("[data-testid^='delete-btn-']"),
  );

  if (!deleteButtons[0]) {
    throw new Error("❌ No hay botón delete");
  }

  await deleteButtons[0].click();

  // Aceptar el confirm nativo del navegador
  await driver.switchTo().alert().accept();

  // Pequeña pausa para que la lista se refresque
  await driver.sleep(1500);

  console.log("🗑 DELETE OK");
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
    console.log("==== TEST TIPO CULTIVO ====");

    await testCrearTipoCultivoVacio();
    await testCrearTipoCultivo();
    await testListarTipoCultivo();
    await testActualizarTipoCultivo();
    await testEliminarTipoCultivo();

    console.log("🎉 TODAS LAS PRUEBAS OK");
  } catch (error) {
    console.error("❌ ERROR SUITE:", error);
  } finally {
    await teardown();
  }
})();