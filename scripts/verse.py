"""
Script to generate SQL queries to add Quran verses to the database from
Quran JSON repository (https://github.com/semarketir/quranjson)
"""
import json

ar_path = "surah/surah_{}.json"
en_path = "translation/en/en_translation_{}.json"

def read_surah(surah):
    res = []
    with open(ar_path.format(surah)) as arf:
        ar = json.load(arf)
    with open(en_path.format(surah)) as enf:
        en = json.load(enf)
    for k in ar["verse"]:
        number = int(k.split("_")[1])
        res.append({
            "surah": surah,
            "number": number,
            "verse_ar": ar["verse"][k],
            "verse_en": en["verse"][k].replace("\"", "\\\"")
        })
    return res


def gen():
    res = []
    for n in range(1, 115):
        res.extend(read_surah(n))

    res.sort(key=lambda i: (i["surah"], i["number"]))
    for index, row in enumerate(res):
        print(f"({index + 2}, {row['surah']}, {row['number']}, \"{row['verse_ar']}\", \"{row['verse_en']}\", \"\"),")



if __name__ == "__main__":
    gen()
