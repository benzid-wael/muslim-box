BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "quran_surah" (
	"id"	INTEGER,
	"name_ar"	TEXT NOT NULL UNIQUE,
	"name_latin"	TEXT NOT NULL UNIQUE,
	"name_en"	TEXT NOT NULL UNIQUE,
	"name_fr"	TEXT NOT NULL UNIQUE,
	"sajda"	INTEGER,
	"ayah"	INTEGER,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "quran_verse" (
	"id"	INTEGER,
	"surah"	INTEGER,
	"number"	INTEGER,
	"verse_ar"	TEXT NOT NULL,
	"verse_en"	TEXT NOT NULL,
	"verse_fr"	TEXT,
	PRIMARY KEY("id"),
	FOREIGN KEY("surah") REFERENCES "quran_surah"("id") ON DELETE RESTRICT
);
CREATE TABLE IF NOT EXISTS "slide" (
	"id"	INTEGER,
	"verse"	INTEGER,
	"playlist"	INTEGER NOT NULL,
	"type"	TEXT NOT NULL,
	"meta"	TEXT,
	"text_ar"	TEXT,
	"text_en"	TEXT,
	"text_fr"	TEXT,
	"note_ar"	TEXT,
	"note_en"	TEXT,
	"note_fr"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("playlist") REFERENCES "playlist"("id"),
	FOREIGN KEY("verse") REFERENCES "quran_verse"("id")
);
CREATE TABLE IF NOT EXISTS "tags" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "slide_tags" (
	"tag"	INTEGER,
	"slide"	INTEGER,
	CONSTRAINT "unique_slide_tags" UNIQUE("slide","tag"),
	FOREIGN KEY("slide") REFERENCES "slide"("id") ON DELETE SET NULL,
	FOREIGN KEY("tag") REFERENCES "tags"("id") ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS "playlist" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
COMMIT;
