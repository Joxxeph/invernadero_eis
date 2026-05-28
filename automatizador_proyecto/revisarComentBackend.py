import os
import re
from pathlib import Path
from dataclasses import dataclass, field


# Ruta base donde viven los archivos .java a inspeccionar
JAVA_SOURCE_DIR = "../invernadero/src/main/java/co/usco/invernadero/"

# Claves que deben aparecer dentro del bloque /** ... */ de cada archivo
REQUIRED_DOC_FIELDS = ("Autor:", "Fecha:", "Propósito:")

# Patrón que identifica una declaración de campo de instancia
# Ejemplos válidos: "private String nombre;" "private List<Long> ids;"
FIELD_PATTERN = re.compile(r"^private\s+[\w<>,\s]+\s+(\w+)\s*;")

# Líneas que se ignoran al buscar campos sin documentar
SKIP_PREFIXES = ("@", "import ", "package ", "public ", "protected ", "//", "/*", "*")


# ------------------------------------------------------------------
#  Estructuras de resultado
# ------------------------------------------------------------------

@dataclass
class FileReport:
    """Resultado del análisis de un único archivo .java"""
    path: Path
    has_doc_block: bool        = False
    doc_block_issues: str      = ""
    undocumented_fields: list  = field(default_factory=list)

    @property
    def passed(self) -> bool:
        return self.has_doc_block and not self.undocumented_fields

    def relative_name(self, base: Path) -> str:
        try:
            return str(self.path.relative_to(base))
        except ValueError:
            return str(self.path)


# ------------------------------------------------------------------
#  Lógica de análisis
# ------------------------------------------------------------------

def _read_lines(java_file: Path) -> list[str]:
    return java_file.read_text(encoding="utf-8").splitlines(keepends=True)


def validate_doc_header(source: str) -> tuple[bool, str]:
    """
    Busca el primer bloque /** ... */ del archivo y comprueba
    que contenga todas las claves de REQUIRED_DOC_FIELDS.
    Retorna (ok, mensaje_de_estado).
    """
    match = re.search(r"/\*\*.*?\*/", source, re.DOTALL)
    if not match:
        return False, "No hay bloque de documentación /** ... */"

    block_text = match.group()
    missing = [k for k in REQUIRED_DOC_FIELDS if k not in block_text]

    if missing:
        return False, "Faltan entradas: " + ", ".join(missing)

    return True, "Cabecera correcta"


def find_undocumented_fields(lines: list[str]) -> list[str]:
    """
    Recorre las líneas del archivo buscando campos 'private'.
    Un campo se considera documentado si hay un '/**' en alguna
    línea anterior, sin que otra declaración de campo lo interrumpa.
    """
    problems = []

    for idx, raw_line in enumerate(lines):
        line = raw_line.strip()

        # Saltamos líneas que no nos interesan
        if not line or line.startswith(SKIP_PREFIXES):
            continue

        m = FIELD_PATTERN.match(line)
        if not m:
            continue

        field_name = m.group(1)

        # Recorremos hacia atrás en busca de /** antes de este campo
        documented = False
        for prev_idx in range(idx - 1, -1, -1):
            prev = lines[prev_idx].strip()
            if prev.startswith("/**"):
                documented = True
                break
            # Si topamos con otro campo antes de ver un /**, no hay doc
            if FIELD_PATTERN.match(prev):
                break

        if not documented:
            problems.append(field_name)

    return problems


def analyse_file(java_file: Path) -> FileReport:
    """Analiza un único archivo y devuelve su FileReport."""
    source = java_file.read_text(encoding="utf-8")
    lines  = source.splitlines(keepends=True)

    doc_ok, doc_msg      = validate_doc_header(source)
    missing_fields       = find_undocumented_fields(lines)

    return FileReport(
        path                = java_file,
        has_doc_block       = doc_ok,
        doc_block_issues    = doc_msg,
        undocumented_fields = missing_fields,
    )


# ------------------------------------------------------------------
#  Recolección de archivos
# ------------------------------------------------------------------

def collect_java_files(root: Path) -> list[Path]:
    """Devuelve todos los .java encontrados de forma recursiva."""
    return sorted(root.rglob("*.java"))


# ------------------------------------------------------------------
#  Presentación de resultados
# ------------------------------------------------------------------

SEPARATOR = "-" * 62

def print_report(report: FileReport, base_dir: Path) -> None:
    label = report.relative_name(base_dir)
    status = "✅ OK" if report.passed else "❌ Revisar"
    print(f"{status}  {label}")

    # Cabecera de documentación
    icon = "✓" if report.has_doc_block else "✗"
    print(f"    [{icon}] Doc header : {report.doc_block_issues}")

    # Campos sin comentario
    if report.undocumented_fields:
        joined = ", ".join(report.undocumented_fields)
        print(f"    [!] Sin doc  : {joined}")
    else:
        print("    [✓] Todos los campos tienen documentación")

    print(SEPARATOR)


def print_summary(reports: list[FileReport]) -> None:
    total   = len(reports)
    passing = sum(1 for r in reports if r.passed)
    failing = total - passing
    print(f"\nResumen: {passing}/{total} archivos correctos", end="")
    if failing:
        print(f"  —  {failing} con observaciones")
    else:
        print()


# ------------------------------------------------------------------
#  Punto de entrada
# ------------------------------------------------------------------

def run() -> None:
    source_dir = Path(JAVA_SOURCE_DIR)

    if not source_dir.exists():
        print(f"[ERROR] Directorio no encontrado: {source_dir}")
        return

    java_files = collect_java_files(source_dir)
    if not java_files:
        print("No se encontraron archivos .java en la ruta indicada.")
        return

    print(f"Analizando {len(java_files)} archivo(s) en '{source_dir}'...\n")
    print(SEPARATOR)

    reports = [analyse_file(f) for f in java_files]
    for report in reports:
        print_report(report, base_dir=source_dir)

    print_summary(reports)


if __name__ == "__main__":
    run()