// src/tests/runner.js
import { execSync } from 'child_process';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Orden específico de ejecución
const suites = [
  'tipoCultivo.selenium.test.js',
  'tipoIdentificacion.selenium.test.js',
  'cultivo.selenium.test.js',
  'persona.selenium.test.js',
  'producto.selenium.test.js',
  'cliente.selenium.test.js',
];

for (const suite of suites) {
  const filePath = join(__dirname, suite);
  console.log(`\n${'='.repeat(50)}`);
  console.log(`▶  Ejecutando: ${suite}`);
  console.log('='.repeat(50));

  try {
    // Cada suite corre en su propio proceso Node, completamente aislada
    execSync(`node "${filePath}"`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`❌ Falló: ${suite}`);
  }
}

console.log('\n🎉 Runner finalizado');