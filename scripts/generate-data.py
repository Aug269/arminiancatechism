#!/usr/bin/env python3
"""Gera os bancos de dados litúrgicos e bíblicos do aplicativo.

Fontes (em scripts/sources/):
  * rcl_readings.txt  — Lecionário Comum Revisado (RCL), propers dominicais e
    dias santos para os Anos A, B e C (https://github.com/neelsmith/rcl).
  * dol-year-1/2.json, dol-holy-days.json, dol-special-occasions.json —
    Daily Office Lectionary do Livro de Oração Comum (MIT, public domain BCP),
    https://github.com/reubenlillie/daily-office.
  * pt_aa.json — texto bíblico em português (Almeida), 66 livros
    (https://github.com/thiagobodruk/bible).

Saídas:
  src/data/lectionary/rclSundays.json
  src/data/lectionary/dailyOfficeYear1.json
  src/data/lectionary/dailyOfficeYear2.json
  src/data/lectionary/dailyOfficeHolyDays.json
  src/data/lectionary/dailyOfficeOccasions.json
  src/data/bible/index.json
  src/data/bible/books/<abbrev>.json

Uso: python3 scripts/generate-data.py
"""
from __future__ import annotations

import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "scripts" / "sources"
LECTIONARY_OUT = ROOT / "src" / "data" / "lectionary"
BIBLE_OUT = ROOT / "src" / "data" / "bible"


def write_json(path: Path, payload) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, separators=(",", ":"))
        handle.write("\n")
    print(f"  · {path.relative_to(ROOT)}  ({path.stat().st_size / 1024:.1f} kB)")


# ---------------------------------------------------------------- RCL Sundays
def build_rcl_sundays() -> None:
    rows = list(csv.DictReader((SRC / "rcl_readings.txt").open(encoding="utf-8"), delimiter="|"))
    entries: dict[str, dict] = {}
    order: list[str] = []
    for row in rows:
        key = row["id"]
        if key not in entries:
            entries[key] = {
                "id": key,
                "label": row["label"].strip(),
                "year": row["year"].strip(),
                "season": row["season"].strip(),
                "fixedDate": row["fixed_date"].strip() or None,
                "notes": row["notes"].strip() or None,
                "tracks": [],
            }
            order.append(key)
        track = row["track"].strip()
        entries[key]["tracks"].append(
            {
                "track": int(track) if track else 0,
                "first": row["first_reading"].strip(),
                "psalm": row["psalm"].strip(),
                "second": row["second_reading"].strip(),
                "gospel": row["gospel"].strip(),
            }
        )
    payload = [entries[k] for k in order]
    write_json(LECTIONARY_OUT / "rclSundays.json", payload)


# ------------------------------------------------------- Daily Office (BCP)
def normalise_office(office: dict) -> dict:
    """Compacta um ofício do lecionário diário num formato estável."""
    out: dict = {}
    if office.get("title"):
        out["title"] = office["title"]
    if office.get("season"):
        out["season"] = office["season"]
    if office.get("week"):
        out["week"] = office["week"]
    if office.get("day"):
        out["day"] = office["day"]
    psalms = office.get("psalms") or {}
    if psalms.get("morning"):
        out["psalmsMorning"] = psalms["morning"]
    if psalms.get("evening"):
        out["psalmsEvening"] = psalms["evening"]
    lessons = office.get("lessons") or {}
    out["lessons"] = lessons
    if office.get("notes"):
        out["notes"] = office["notes"]
    return out


def build_daily_office() -> None:
    for year, filename in ((1, "dol-year-1.json"), (2, "dol-year-2.json")):
        raw = json.loads((SRC / filename).read_text(encoding="utf-8"))
        payload = [normalise_office(o) for o in raw]
        write_json(LECTIONARY_OUT / f"dailyOfficeYear{year}.json", payload)

    holy = json.loads((SRC / "dol-holy-days.json").read_text(encoding="utf-8"))
    write_json(LECTIONARY_OUT / "dailyOfficeHolyDays.json", [normalise_office(o) for o in holy])

    occasions = json.loads((SRC / "dol-special-occasions.json").read_text(encoding="utf-8"))
    write_json(
        LECTIONARY_OUT / "dailyOfficeOccasions.json",
        [normalise_office(o) for o in occasions],
    )


# ---------------------------------------------------------------------- Bíblia
# Abreviações usadas no lecionário (SBL, às vezes sem padronização) → abreviação
# do banco bíblico em português.
BOOK_ALIASES = {
    "gen": "gn", "exod": "ex", "lev": "lv", "num": "nm", "deut": "dt",
    "josh": "js", "judg": "jz", "ruth": "rt", "1 sam": "1sm", "2 sam": "2sm",
    "1 kgs": "1rs", "2 kgs": "2rs", "1 kings": "1rs", "2 kings": "2rs",
    "1 chr": "1cr", "2 chr": "2cr", "ezra": "ed", "neh": "ne", "esth": "et",
    "job": "jó", "psalm": "sl", "psalms": "sl", "ps": "sl", "prov": "pv",
    "eccles": "ec", "song": "ct", "isa": "is", "jer": "jr", "lam": "lm",
    "ezek": "ez", "dan": "dn", "hos": "os", "joel": "jl", "amos": "am",
    "obad": "ob", "jonah": "jn", "mic": "mq", "nah": "na", "hab": "hc",
    "zeph": "sf", "hag": "ag", "zech": "zc", "mal": "ml", "matt": "mt",
    "mark": "mc", "luke": "lc", "john": "jo", "acts": "atos", "rom": "rm",
    "1 cor": "1co", "2 cor": "2co", "gal": "gl", "eph": "ef", "phil": "fp",
    "col": "cl", "1 thess": "1ts", "2 thess": "2ts", "1 tim": "1tm",
    "2 tim": "2tm", "titus": "tt", "phlm": "fm", "philem": "fm", "heb": "hb",
    "james": "tg", "jas": "tg", "1 pet": "1pe", "2 pet": "2pe", "1 john": "1jo",
    "2 john": "2jo", "3 john": "3jo", "jude": "jd", "rev": "ap",
}


# Nomes completos (SBL/português) usados pelo Lecionário Comum Revisado.
FULL_NAMES = {
    "genesis": "gn", "gênesis": "gn", "exodus": "ex", "êxodo": "ex", "leviticus": "lv",
    "levítico": "lv", "numbers": "nm", "números": "nm", "deuteronomy": "dt",
    "deuteronômio": "dt", "joshua": "js", "josué": "js", "judges": "jz", "juízes": "jz",
    "ruth": "rt", "rute": "rt", "1 samuel": "1sm", "2 samuel": "2sm", "1 kings": "1rs",
    "2 kings": "2rs", "1 reis": "1rs", "2 reis": "2rs", "1 chronicles": "1cr",
    "2 chronicles": "2cr", "1 crônicas": "1cr", "2 crônicas": "2cr", "ezra": "ed",
    "esdras": "ed", "nehemiah": "ne", "neemias": "ne", "esther": "et", "ester": "et",
    "job": "job", "jó": "job", "psalm": "sl", "psalms": "sl", "salmo": "sl",
    "salmos": "sl", "proverbs": "pv", "provérbios": "pv", "ecclesiastes": "ec",
    "eclesiastes": "ec", "song of solomon": "ct", "cantares": "ct", "isaiah": "is",
    "isaías": "is", "jeremiah": "jr", "jeremias": "jr", "lamentations": "lm",
    "lamentações": "lm", "ezekiel": "ez", "ezequiel": "ez", "daniel": "dn",
    "hosea": "os", "oseias": "os", "joel": "jl", "amos": "am", "obadiah": "ob",
    "obadias": "ob", "jonah": "jn", "jonas": "jn", "micah": "mq", "miqueias": "mq",
    "nahum": "na", "naum": "na", "habakkuk": "hc", "habacuque": "hc",
    "zephaniah": "sf", "sofonias": "sf", "haggai": "ag", "ageu": "ag",
    "zechariah": "zc", "zacarias": "zc", "malachi": "ml", "malaquias": "ml",
    "matthew": "mt", "mateus": "mt", "mark": "mc", "marcos": "mc", "luke": "lc",
    "lucas": "lc", "john": "jo", "joão": "jo", "acts": "atos", "atos": "atos",
    "romans": "rm", "romanos": "rm", "1 corinthians": "1co", "2 corinthians": "2co",
    "1 coríntios": "1co", "2 coríntios": "2co", "galatians": "gl", "gálatas": "gl",
    "ephesians": "ef", "efésios": "ef", "philippians": "fp", "filipenses": "fp",
    "colossians": "cl", "colossenses": "cl", "1 thessalonians": "1ts",
    "2 thessalonians": "2ts", "1 tessalonicenses": "1ts", "2 tessalonicenses": "2ts",
    "1 timothy": "1tm", "2 timothy": "2tm", "1 timóteo": "1tm", "2 timóteo": "2tm",
    "titus": "tt", "tito": "tt", "philemon": "fm", "filemom": "fm", "hebrews": "hb",
    "hebreus": "hb", "james": "tg", "tiago": "tg", "1 peter": "1pe", "2 peter": "2pe",
    "1 pedro": "1pe", "2 pedro": "2pe", "1 john": "1jo", "2 john": "2jo",
    "3 john": "3jo", "1 joão": "1jo", "2 joão": "2jo", "3 joão": "3jo",
    "jude": "jd", "judas": "jd", "revelation": "ap", "apocalipse": "ap",
    # Deuterocanônicos (não incluídos na edição local)
    "sirach": "miss:sir", "ecclesiasticus": "miss:sir", "eclesiástico": "miss:sir",
    "wisdom": "miss:wis", "sabedoria": "miss:wis", "1 maccabees": "miss:1macc",
    "2 maccabees": "miss:2macc", "1 macabeus": "miss:1macc", "2 macabeus": "miss:2macc",
    "tobit": "miss:tob", "tobias": "miss:tob", "judith": "miss:jdt", "judite": "miss:jdt",
    "baruch": "miss:bar", "baruc": "miss:bar", "baruque": "miss:bar",
    "2 esdras": "miss:2esd", "1 esdras": "miss:1esd",
}


def build_bible() -> None:
    raw = json.loads((SRC / "pt_aa.json").read_text(encoding="utf-8-sig"))
    index = []
    books_dir = BIBLE_OUT / "books"
    books_dir.mkdir(parents=True, exist_ok=True)
    for entry in raw:
        abbrev = "job" if entry["abbrev"] == "jó" else entry["abbrev"]
        name = entry["name"]
        chapters = entry["chapters"]
        write_json(books_dir / f"{abbrev}.json", {"abbrev": abbrev, "name": name, "chapters": chapters})
        index.append({"abbrev": abbrev, "name": name, "chapters": len(chapters)})
    write_json(BIBLE_OUT / "index.json", index)
    write_json(BIBLE_OUT / "aliases.json", {**BOOK_ALIASES, **FULL_NAMES})


if __name__ == "__main__":
    print("Gerando dados litúrgicos…")
    build_rcl_sundays()
    build_daily_office()
    print("Gerando banco bíblico…")
    build_bible()
    print("Concluído.")
