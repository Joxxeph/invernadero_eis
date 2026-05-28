import json
import re
import os
from pathlib import Path
from dataclasses import dataclass, field
from datetime import datetime
from jinja2 import Environment, FileSystemLoader, TemplateNotFound


# =================================================================
#  Configuración del proyecto
# =================================================================
AUTHOR_NAME    = "Joseph Gutierrez Martinez"
BUILD_DATE     = datetime.now().strftime("%Y-%m-%d")
TEMPLATES_PATH = "templates"
OUTPUT_PATH    = "output"

# Tipos de <input> HTML que corresponden a cada tipo lógico del schema
INPUT_TYPE_MAP = {
    "date":     "date",
    "datetime": "datetime-local",
    "integer":  "number",
    "decimal":  "number",
    "boolean":  "checkbox",
}

# Campos que se omiten al construir formularios y tablas (son PKs autogeneradas)
SKIP_TYPES = {"identity"}


# =================================================================
#  Motor Jinja2
# =================================================================
def _create_jinja_env(templates_dir: str) -> Environment:
    path = Path(templates_dir)
    if not path.is_dir():
        raise FileNotFoundError(f"Carpeta de templates no encontrada: '{templates_dir}'")
    return Environment(
        loader=FileSystemLoader(str(path)),
        trim_blocks=True,
        lstrip_blocks=True,
    )

jinja_env = _create_jinja_env(TEMPLATES_PATH)


# =================================================================
#  Conversores de nomenclatura
# =================================================================

def to_pascal(snake: str) -> str:
    """snake_case -> PascalCase  (tipo_cultivo -> TipoCultivo)"""
    return "".join(w.capitalize() for w in snake.split("_"))


def to_camel(snake: str) -> str:
    """snake_case -> camelCase  (tipo_cultivo -> tipoCultivo)"""
    parts = snake.split("_")
    return parts[0] + "".join(w.capitalize() for w in parts[1:])


def to_kebab(snake: str) -> str:
    """snake_case -> kebab-case  (tipo_cultivo -> tipo-cultivo)"""
    return snake.replace("_", "-")


# =================================================================
#  Helpers de lectura del schema
# =================================================================

def _attr_is_skippable(attr: dict) -> bool:
    """Devuelve True para PKs y campos identity que no van en forms/tablas."""
    return attr.get("pk", False) or attr.get("type") in SKIP_TYPES


def _build_relation_map(entity: dict) -> dict:
    """
    Construye un diccionario { campo_local -> nombre_entidad_relacionada }
    a partir de las relaciones definidas en la entidad.
    """
    return {
        rel["local_field"]: rel["entity"]
        for rel in entity.get("relations", [])
    }


def _resolve_display_field(related_entity: str) -> str:
    """
    Heurística para elegir el campo de display de una FK.
    Si la entidad relacionada tiene 'persona' en el nombre, se muestra
    'identificacion'; en cualquier otro caso se usa 'nombre'.
    """
    return "identificacion" if "persona" in related_entity else "nombre"


# =================================================================
#  Construcción de columnas para la tabla React
# =================================================================

def build_table_columns(entity: dict) -> list:
    """
    Genera la lista de descriptores de columna que consume el template Table.jsx.
    Las FKs se muestran como campos anidados (ej: persona.identificacion).
    """
    relation_map = _build_relation_map(entity)
    entity_name  = entity["name"]

    # La columna ID siempre encabeza la tabla
    columns = [{"field": "id", "label": "ID", "t_key": None}]

    for attr in entity.get("attributes", []):
        if _attr_is_skippable(attr):
            continue

        name = attr["name"]
        t_key = f"{entity_name}.{to_camel(name)}"

        if name in relation_map:
            related   = relation_map[name]
            disp_fld  = _resolve_display_field(related)
            columns.append({"field": f"{related}.{disp_fld}", "label": name, "t_key": t_key})
        else:
            columns.append({"field": name, "label": name, "t_key": t_key})

    return columns


# =================================================================
#  Construcción de campos del formulario React
# =================================================================

def build_form_fields(entity: dict) -> list:
    """
    Genera los descriptores de campo para Formik/Yup.
    Incluye tipo de input, banderas de validación y metadatos para selects FK.
    """
    relation_map = _build_relation_map(entity)
    entity_name  = entity["name"]
    result       = []

    for attr in entity.get("attributes", []):
        if _attr_is_skippable(attr):
            continue

        name         = attr["name"]
        logical_type = attr.get("type", "string")
        nullable     = attr.get("nullable", True)
        related      = relation_map.get(name)

        result.append({
            "name":                   name,
            "camel_name":             to_camel(name),
            "nullable":               nullable,
            "type":                   logical_type,
            "is_select":              name in relation_map,
            "related_entity":         related,
            "related_entity_pascal":  to_pascal(related) if related else None,
            "t_key_label":            f"{entity_name}.{to_camel(name)}",
            "t_key_error":            f"{entity_name}.{to_camel(name)}Obligatorio",
            "input_type":             INPUT_TYPE_MAP.get(logical_type, "text"),
            "data_testid":            f"{entity_name}-{to_kebab(name)}-input",
        })

    return result


# =================================================================
#  Validaciones Yup
# =================================================================

def build_yup_schema(entity: dict) -> list:
    """
    Construye la cadena de validación Yup para cada campo del formulario.
    Cada entrada contiene el nombre del campo y su cadena de métodos Yup.
    """
    relation_fields = set(_build_relation_map(entity).keys())
    entity_name     = entity["name"]
    validations     = []

    for attr in entity.get("attributes", []):
        if _attr_is_skippable(attr):
            continue

        name         = attr["name"]
        logical_type = attr.get("type", "string")
        nullable     = attr.get("nullable", True)
        t_required   = f'{entity_name}.{to_camel(name)}Obligatorio'

        chain = _yup_chain_for(
            name=name,
            logical_type=logical_type,
            nullable=nullable,
            is_fk=name in relation_fields,
            entity_name=entity_name,
            t_required=t_required,
        )
        validations.append({"name": name, "chain": "\n      ".join(chain)})

    return validations


def _yup_chain_for(
    name: str,
    logical_type: str,
    nullable: bool,
    is_fk: bool,
    entity_name: str,
    t_required: str,
) -> list:
    """
    Devuelve la lista de llamadas Yup que formarán la cadena de validación.
    Separado de build_yup_schema para que sea más fácil de testear o extender.
    """
    chain = []

    if is_fk:
        chain.append("Yup.number()")
        chain.append(f'.typeError(t("{t_required}"))')
        if not nullable:
            chain.append(f'.required(t("{t_required}"))')

    elif logical_type in ("integer", "decimal"):
        chain.append("Yup.number()")
        chain.append(f'.typeError(t("{entity_name}.debeSerNumero"))')
        if not nullable:
            chain.append(f'.required(t("{t_required}"))')
        # Rango especial para campos de descuento
        if logical_type == "decimal" and "descuento" in name:
            rng_key = f"{entity_name}.descuentoRango"
            chain.append(f'.min(0, t("{rng_key}"))')
            chain.append(f'.max(100, t("{rng_key}"))')

    elif logical_type in ("date", "datetime"):
        chain.append("Yup.date()")
        if nullable:
            chain.append(".nullable()")
        if not nullable:
            chain.append(f'.required(t("{t_required}"))')

    elif logical_type == "boolean":
        chain.append("Yup.boolean()")

    else:
        chain.append("Yup.string()")
        if not nullable:
            chain.append(f'.required(t("{t_required}"))')

    return chain


# =================================================================
#  Valores iniciales de Formik
# =================================================================

def build_initial_values(entity: dict) -> list:
    """Genera los pares (campo, valor_vacío) para initialValues de Formik."""
    return [
        {"name": attr["name"], "default": '""'}
        for attr in entity.get("attributes", [])
        if not _attr_is_skippable(attr)
    ]


# =================================================================
#  Imports y funciones de API
# =================================================================

def build_api_config(entity: dict) -> dict:
    """
    Genera los nombres de las funciones CRUD y la ruta del módulo API
    que el componente necesita importar.
    """
    pascal = to_pascal(entity["name"])
    camel  = to_camel(entity["name"])
    return {
        "get_fn":    f"get{pascal}",
        "create_fn": f"create{pascal}",
        "update_fn": f"update{pascal}",
        "delete_fn": f"delete{pascal}",
        "api_module": f"../../api/{camel}Api",
    }


def build_select_imports(entity: dict) -> list:
    """
    Para cada FK de la entidad, genera la info necesaria para importar
    la función de listado de la entidad relacionada (usada en <select>).
    """
    imports = []
    for rel in entity.get("relations", []):
        rel_entity = rel["entity"]
        imports.append({
            "get_fn":      f"get{to_pascal(rel_entity)}",
            "api_module":  f"../../api/{to_camel(rel_entity)}Api",
            "state_name":  f"{to_camel(rel_entity)}s",
            "entity_name": rel_entity,
            "local_field": rel["local_field"],
        })
    return imports


# =================================================================
#  Post-proceso del JSX generado
# =================================================================

def _fix_jsx_indentation(jsx: str) -> str:
    """
    Corrige artefactos de indentación que Jinja2 introduce al renderizar
    bloques JSX (render props de Formik, expresiones {array.map(...)}).
    Elimina también líneas en blanco excesivas (más de 2 seguidas).
    """
    cleaned_lines = []
    for line in jsx.split("\n"):
        stripped = line.lstrip()

        if stripped.startswith("{({") and not line.startswith("        "):
            line = "        " + stripped
        elif stripped == "}}" and not line.startswith("        "):
            line = "        " + stripped
        elif re.match(r"^\{[a-z]", stripped):
            leading = len(line) - len(stripped)
            if leading < 18:
                line = "                  " + stripped

        cleaned_lines.append(line)

    return re.sub(r"\n{3,}", "\n\n", "\n".join(cleaned_lines))


# =================================================================
#  Escritura de archivos
# =================================================================

def write_file(template_name: str, context: dict, dest: str) -> None:
    """
    Renderiza un template Jinja2 con el contexto dado y escribe el resultado.
    Aplica post-proceso de indentación cuando el destino es un archivo .jsx.
    """
    try:
        tpl = jinja_env.get_template(template_name)
    except TemplateNotFound:
        print(f"  [ERROR] Template no encontrado: {template_name}")
        return

    content = tpl.render(context)

    if template_name.endswith(".jsx.j2"):
        content = _fix_jsx_indentation(content)

    output_file = Path(dest)
    output_file.parent.mkdir(parents=True, exist_ok=True)
    output_file.write_text(content, encoding="utf-8")
    print(f"  ✅ {dest}")


# =================================================================
#  Carga del schema
# =================================================================

def load_schema(schema_path: str) -> dict:
    path = Path(schema_path)
    if not path.exists():
        raise FileNotFoundError(f"No se encontró el schema en: {schema_path}")
    with path.open(encoding="utf-8") as fp:
        return json.load(fp)


# =================================================================
#  Procesamiento por entidad
# =================================================================

def process_entity(entity: dict) -> None:
    """Genera Form.jsx y Table.jsx para una entidad del schema."""
    pascal = to_pascal(entity["name"])
    camel  = to_camel(entity["name"])

    print(f"📦 Entidad: {pascal}")

    ctx = {
        "entity_name":    entity["name"],
        "pascal":         pascal,
        "camel":          camel,
        "kebab":          to_kebab(entity["name"]),
        "columns":        build_table_columns(entity),
        "form_fields":    build_form_fields(entity),
        "yup_validations": build_yup_schema(entity),
        "initial_values": build_initial_values(entity),
        "api":            build_api_config(entity),
        "select_imports": build_select_imports(entity),
        "author":         AUTHOR_NAME,
        "date":           BUILD_DATE,
    }

    write_file("Form.jsx.j2",  ctx, f"{OUTPUT_PATH}/components/{pascal}Form.jsx")
    write_file("Table.jsx.j2", ctx, f"{OUTPUT_PATH}/components/{pascal}Table.jsx")


# =================================================================
#  Punto de entrada
# =================================================================

def run() -> None:
    schema = load_schema("schema.json")

    project = schema.get("proyecto", "proyecto")
    print(f"\n🚀 Generando componentes React para: {project}\n")

    entities = schema.get("entities", [])
    if not entities:
        print("[AVISO] El schema no contiene entidades.")
        return

    for entity in entities:
        process_entity(entity)

    print(f"\n✅ Generación completa. Archivos en: '{OUTPUT_PATH}/components/'")


if __name__ == "__main__":
    run()