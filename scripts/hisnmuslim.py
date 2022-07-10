import csv
from collections import defaultdict
from itertools import count
import re


config = {
    "en": "hisn-muslim-english.csv",
    "ar": "hisn-muslim-arabic.csv",
}
cseq = count(1)
dseq = count(1)


def normalize(c):
    return re.sub(r'\s+', ' ', c).replace("\"", "\"\"").replace("'", "''")

def parse(path, lang, cats, dhikr):
    with open(path, "r") as csvfile:
        reader = csv.reader(csvfile, delimiter=",", quotechar="\"")
        for row in reader:
            pk = row[0]
            cats[pk][lang] = row[2]
            dhikr[pk][lang] = row[1]
            if lang == "en":
                dhikr[pk]["category"] = row[2]

def parse(mapping):
    cats = defaultdict(dict)
    dhikr = defaultdict(dict)
    unique_cats = set()
    for lang in mapping:
        parse(mapping[lang], lang, cats, dhikr)

    categories = {}
    for k in cats:
        if k == "id" or cats[k]["en"] in unique_cats:
            continue
        unique_cats.add(cats[k]["en"])
        categories[cats[k]["en"]] = {
            "id": next(cseq),
            **{f"name_{lang}": cats[k][lang] for lang in mapping}
        }

    dhikr = [{
        "id": next(dseq),
        "category_id": categories[dhikr[k]["category"]]["id"],
        **{f"name_{lang}": dhikr[k][lang] for lang in mapping}
    } for k in dhikr if k != "id"]

    return categories, dhikr

def main(cfg):
    categories, dhikr = parse(cfg)

    langs = list(mapping.keys())
    columns = ', '.join([f"`name_{l}`" for l in langs])
    print(f"INSERT INTO category (`id`, {columns}) VALUES")
    for i, cat in enumerate(categories.values()):
        term = ";" if i == len(categories) - 1 else ","
        names = ",".join("\"{}\"".format(cat[f"name_{lang}"]) for lang in langs)
        print(f"({cat['id']}, {names}){term}")

    print("\n\n")
    print(f"INSERT INTO slide (`type`, `category`, `content_ar`, `content_en`) VALUES")
    for i, d in enumerate(dhikr):
        term = ";" if i == len(dhikr) - 1 else ","
        print(f"(\"dhikr\", {d['category_id']}, \"{normalize(d['name_ar'])}\", \"{normalize(d['name_en'])}\"){term}")


if __name__ == '__main__':
    main(config)
