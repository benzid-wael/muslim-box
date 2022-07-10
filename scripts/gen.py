"""
Generate sql file to ingest all data in the provided Google Sheet

The Google sheet contains the following metadata sheets
- tags (id, name, Description)
- category (id, name_ar, name_en, name_fr, Tags)
- Book (Book, Author)
- Rawii (Name)


Note: You can check the type of any cell, by checking the ctype value. Below the supported types:
- XL_CELL_EMPTY
- XL_CELL_TEXT
- XL_CELL_NUMBER
- XL_CELL_DATE
- XL_CELL_BOOLEAN
- XL_CELL_ERROR
- XL_CELL_BLANK
"""
import json
import re
from itertools import count

import xlrd  # v1.2.0


def get_value(cell):
    if cell.ctype in (xlrd.XL_CELL_EMPTY, xlrd.XL_CELL_BLANK):
        return None
    elif cell.ctype in (xlrd.XL_CELL_NUMBER, xlrd.XL_CELL_DATE):
        return int(cell.value)
    elif cell.ctype == xlrd.XL_CELL_BOOLEAN:
        return bool(int(cell.value))
    return cell.value.strip()


def read_xlrd(path):
    xls = xlrd.open_workbook(path, on_demand=True)
    # print(f"sheets: {xls.sheet_names()}")
    return xls


def parse_sheet(xls, name, callback, pk_field="id", remove_pk=False):
    data = {}
    for i, r in enumerate(xls.sheet_by_name(name).get_rows()):
        if i == 0:
            continue
        row = callback(r)
        data[row[pk_field]] = {k: row[k] for k in row if k != pk_field or not remove_pk}
    return data


def get_resolvers(xls):
    tags = parse_sheet(
        xls,
        "tags",
        lambda r: {"id": get_value(r[0]), "name": get_value(r[1]), "description": get_value(r[2])},
        pk_field="name",
    )
    categories = parse_sheet(
        xls,
        "category",
        lambda r: {"id": get_value(r[0]), "name_ar": get_value(r[1]), "name_en": get_value(r[2]), "name_fr": get_value(r[3])},
        pk_field="name_ar",
    )
    books = parse_sheet(
        xls,
        "Book",
        lambda r: {"name_ar": get_value(r[0]), "source": {"name_ar": get_value(r[0])}, "author": {"name_ar": get_value(r[1])}},
        pk_field="name_ar",
        remove_pk=True,
    )
    rowat = parse_sheet(
        xls,
        "Rawii",
        lambda r: {"name_ar": get_value(r[0])},
        pk_field="name_ar",
    )
    return {
        "tags": tags,
        "categories": categories,
        "books": books,
        "rowat": rowat,
    }


class Header:
    ID = 0
    TYPE = 1
    RAWII = 2
    SOURCE = 3
    PAGE_NO = 4
    CATEGORY = 5
    TAGS = 6
    CONTENT_AR = 7
    CONTENT_EN = 8
    COUNT = 10

def parse_data(xls, data, name, resolvers, callback=None, default_type="hadith"):
    # id: 0, type: 1, rawii: 2, source: 3
    # page/no: 4, category: 5, tags: 6,
    # content_ar: 6, content_en: 7
    # optional: category_id, count
    for i, r in enumerate(xls.sheet_by_name(name).get_rows()):
        if i == 0:
            continue
        category = get_value(r[Header.CATEGORY])
        category_id = resolvers["categories"][category]["id"] if category else None
        tags = get_value(r[Header.TAGS]) or []
        if tags:
            # print(f"{i} - tags: {tags}")
            tags = [resolvers["tags"][t.strip()]["id"] for t in tags.split(',')]
        meta = {
            "rawii": resolvers["rowat"].get(get_value(r[Header.RAWII]), {}),
            "page_number": get_value(r[Header.PAGE_NO]),
            **resolvers["books"].get(get_value(r[Header.SOURCE]), {})
        }
        row = {
            "id": get_value(r[Header.ID]),
            "type": get_value(r[Header.TYPE]) or default_type,
            "category": category_id,
            "tags": tags,
            "content_ar": get_value(r[Header.CONTENT_AR]),
            "content_en": get_value(r[Header.CONTENT_EN]),
            "content_fr": None,
            "count": get_value(r[Header.COUNT]),
            "meta": meta,
        }
        if callback:
            row = callback(r, row)
        data.append(row)


def normalize(c):
    if not c:
        return "null"
    if type(c) == str:
        val = re.sub(r'\s+', ' ', c).replace("\"", "\"\"").replace("'", "''")
        return f"\"{val}\""
    return c


def main(path, hadith_sheets):
    xls = read_xlrd(path)
    resolvers = get_resolvers(xls)
    data = []
    parse_data(xls, data, "Hisn Muslim", resolvers, default_type="dhikr")
    for sheet in hadith_sheets:
        parse_data(xls, data, sheet, resolvers)

    print("\n\nINSERT INTO tags (`id`, `name`) VALUES")
    rows = list(resolvers["tags"].values())
    for i, row in enumerate(rows):
        term = ";" if i == len(rows) - 1 else ","
        print(f"({row['id']}, {normalize(row['name'])}){term}")

    print("\n\nINSERT INTO category (`id`, `name_ar`, `name_en`) VALUES")
    rows = list(resolvers["categories"].values())
    for i, row in enumerate(rows):
        term = ";" if i == len(rows) - 1 else ","
        print(f"({row['id']}, {normalize(row['name_ar'])}, {normalize(row['name_en'])}){term}")

    slide_tags = []
    print("\n\nINSERT INTO slide (`id`, `type`, `category`, `count`, `meta`, `content_ar`, `content_en`) VALUES")
    for i, row in enumerate(data):
        term = ";" if i == len(data) - 1 else ","
        meta = json.dumps(row["meta"]) if row["meta"] else None
        print(f"({row['id']}, {normalize(row['type'])}, {normalize(row['category'])}, {normalize(row['count'])}, {normalize(meta)}, {normalize(row['content_ar'])}, {normalize(row['content_en'])}){term}")
        for tag in row["tags"]:
            slide_tags.append({"slide": row["id"], "tag": tag})

    # generate tags
    print("\n\nINSERT INTO slide_tags (`slide`, `tag`) VALUES")
    for i, row in enumerate(slide_tags):
        term = ";" if i == len(slide_tags) - 1 else ","
        print(f"({row['slide'] or (i + 1)}, {row['tag']}){term}")



if __name__ == "__main__":
    hadith_sheets = ['Ramdhan', 'Dhul Hijjah', 'Friday', 'MondayThursday', 'Nawaweyah', 'Generic']
    main("~/Downloads/Ahadith grouped by theme.xlsx", hadith_sheets)
