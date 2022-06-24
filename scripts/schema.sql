BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "quran_surah" (
	"id"			INTEGER,
	"name_ar"		TEXT NOT NULL UNIQUE,
	"name_latin"	TEXT NOT NULL UNIQUE,
	"name_en"		TEXT NOT NULL UNIQUE,
	"name_fr"		TEXT NOT NULL UNIQUE,
	"sajda"			INTEGER,
	"ayah"			INTEGER,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "quran_verse" (
	"id"			INTEGER,
	"surah"			INTEGER,
	"number"		INTEGER,
	"verse_ar"		TEXT NOT NULL,
	"verse_en"		TEXT NOT NULL,
	"verse_fr"		TEXT,
	PRIMARY KEY("id"),
	FOREIGN KEY("surah") REFERENCES "quran_surah"("id") ON DELETE RESTRICT
);
CREATE TABLE IF NOT EXISTS "tags" (
	"id"			INTEGER,
	"name"			TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "slide_tags" (
	"tag"			INTEGER,
	"slide"			INTEGER,
	CONSTRAINT "unique_slide_tags" UNIQUE("slide", "tag"),
	FOREIGN KEY("tag") REFERENCES "tags"("id") ON DELETE SET NULL,
	FOREIGN KEY("slide") REFERENCES "slide"("id") ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS "playlist" (
	"id"			INTEGER,
	"name"			TEXT NOT NULL UNIQUE,
	"active"		INTEGER NOT NULL DEFAULT 1 CHECK("active" IN (0, 1)),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "slide" (
	"id"			INTEGER,
	"type"			TEXT NOT NULL CHECK("type" IN ("quran", "hadith", "dhikr", "event")),
	"active"		INTEGER NOT NULL DEFAULT 1 CHECK("active" IN (0, 1)),
	"meta"			TEXT,
	"verse_start"	INTEGER,
	"verse_end"		INTEGER,
	"content_ar"	TEXT,
	"content_en"	TEXT,
	"content_fr"	TEXT,
	"note_ar"		TEXT,
	"note_en"		TEXT,
	"note_fr"		TEXT,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("verse_start") REFERENCES "quran_verse"("id") ON DELETE RESTRICT,
	FOREIGN KEY("verse_end") REFERENCES "quran_verse"("id") ON DELETE RESTRICT
);
CREATE TABLE IF NOT EXISTS "slide_playlist" (
	"id"			INTEGER,
	"slide"			INTEGER NOT NULL,
	"playlist"		INTEGER NOT NULL,
	"active"		INTEGER NOT NULL DEFAULT 1 CHECK("active" IN (0, 1)),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("slide") REFERENCES "slide"("id") ON DELETE CASCADE,
	FOREIGN KEY("playlist") REFERENCES "playlist"("id") ON DELETE CASCADE
);
COMMIT;
