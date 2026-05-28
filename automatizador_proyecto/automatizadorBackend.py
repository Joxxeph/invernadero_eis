import json
import os
from pathlib import Path
from jinja2 import Environment, FileSystemLoader, TemplateNotFound
from datetime import datetime


# =========================================================
#  Ajustes del proyecto - modifica según necesites
# =========================================================
BASE_PACKAGE    = "co.usco.invernadero"
AUTHOR_NAME     = "Joseph Gutierrez Martinez"
GENERATION_DATE = datetime.now().strftime("%Y-%m-%d")
TEMPLATES_PATH  = "templatesBackend"
BUILD_OUTPUT    = "outputBackend"


# =========================================================
#  Motor de plantillas
# =========================================================
def build_env(templates_dir: str) -> Environment:
    if not Path(templates_dir).is_dir():
        raise FileNotFoundError(
            f"No existe el directorio de plantillas: '{templates_dir}'"
        )
    return Environment(
        loader=FileSystemLoader(templates_dir),
        trim_blocks=True,
        lstrip_blocks=True,
    )


jinja_env = build_env(TEMPLATES_PATH)


# =========================================================
#  Conversiones de tipos y nombres
# =========================================================
JAVA_TYPE_MAP = {
    "string":   "String",
    "integer":  "Integer",
    "decimal":  "BigDecimal",
    "boolean":  "Boolean",
    "date":     "LocalDate",
    "datetime": "LocalDateTime",
    "identity": "Long",
}


def pascal_case(snake: str) -> str:
    """Convierte snake_case a PascalCase. Ej: tipo_sensor -> TipoSensor"""
    return "".join(part.capitalize() for part in snake.split("_"))


def resolve_java_type(logical_type: str) -> str:
    return JAVA_TYPE_MAP.get(logical_type, "String")


# =========================================================
#  Construcción del contexto por entidad
# =========================================================
def extract_fk_fields(entity_def: dict) -> set:
    """Devuelve los nombres de campo que actúan como FK en esta entidad."""
    return {r["local_field"] for r in entity_def.get("relations", [])}


def build_field_list(entity_def: dict) -> list:
    fk_set = extract_fk_fields(entity_def)
    result = []

    for attr in entity_def.get("attributes", []):
        is_fk = attr["name"] in fk_set
        result.append({
            "name":        attr["name"],
            "type":        resolve_java_type(attr["type"]),
            "pk":          attr.get("pk", False),
            "not_null":    not attr.get("nullable", True),
            "description": attr.get("description", ""),
            "insertable":  not is_fk,
            "updatable":   not is_fk,
        })

    return result


def build_relation_list(entity_def: dict) -> list:
    return [
        {
            "local_field": rel["local_field"],
            "class_name":  pascal_case(rel["entity"]),
            "field_name":  rel["entity"],
        }
        for rel in entity_def.get("relations", [])
    ]


def make_context(entity_def: dict) -> dict:
    class_name = pascal_case(entity_def["name"])
    return {
        "package":    BASE_PACKAGE,
        "class_name": class_name,
        "url_name":   entity_def["name"],
        "fields":     build_field_list(entity_def),
        "relations":  build_relation_list(entity_def),
        "author":     AUTHOR_NAME,
        "date":       GENERATION_DATE,
    }


# =========================================================
#  Escritura de archivos generados
# =========================================================
def write_from_template(template_name: str, ctx: dict, dest: str) -> None:
    try:
        tpl = jinja_env.get_template(template_name)
    except TemplateNotFound:
        print(f"[AVISO] Plantilla no encontrada: {template_name}")
        return

    output_path = Path(dest)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(tpl.render(ctx), encoding="utf-8")
    print(f"  ✓  {dest}")


# Relación template -> subdirectorio y sufijo de archivo
ENTITY_ARTIFACTS = [
    ("entity.java.j2",      "model",      "",             ".java"),
    ("repository.java.j2",  "repository", "Repository",   ".java"),
    ("service.java.j2",     "service",    "Service",      ".java"),
    ("controller.java.j2",  "controller", "Controller",   ".java"),
]


def generate_entity_files(entity_def: dict) -> None:
    ctx = make_context(entity_def)
    for tpl_name, subdir, suffix, ext in ENTITY_ARTIFACTS:
        filename  = f"{ctx['class_name']}{suffix}{ext}"
        dest_path = f"{BUILD_OUTPUT}/{subdir}/{filename}"
        write_from_template(tpl_name, ctx, dest_path)


# =========================================================
#  Carga del esquema
# =========================================================
def load_schema(path: str) -> dict:
    schema_file = Path(path)
    if not schema_file.exists():
        raise FileNotFoundError(f"No se encontró el esquema en: {path}")

    with schema_file.open(encoding="utf-8") as fp:
        return json.load(fp)


# =========================================================
#  Punto de entrada
# =========================================================
def run() -> None:
    print("Iniciando generación de código backend...\n")

    schema = load_schema("schema.json")
    entities = schema.get("entities", [])

    if not entities:
        print("[AVISO] El esquema no contiene entidades. Revisa schema.json.")
        return

    for entity_def in entities:
        entity_label = entity_def.get("name", "sin nombre")
        print(f"Procesando: {entity_label}")
        generate_entity_files(entity_def)

    # Manejador global de excepciones (archivo compartido, no por entidad)
    shared_ctx = {
        "package": BASE_PACKAGE,
        "author":  AUTHOR_NAME,
        "date":    GENERATION_DATE,
    }
    write_from_template(
        "exceptionhandler.java.j2",
        shared_ctx,
        f"{BUILD_OUTPUT}/exception/GlobalExceptionHandler.java",
    )

    print(f"\nListo. Archivos disponibles en: {BUILD_OUTPUT}/")


if __name__ == "__main__":
    run()