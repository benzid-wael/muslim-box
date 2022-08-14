const sqlite3 = require("sqlite3").verbose();

class Database {
  constructor(path, db) {
    this.path = path;
    if (path === ":memory:" && !!db) {
      this.database = db;
    } else {
      this.database = new sqlite3.Database(path);
    }
  }

  /*
   * Factory method to create a database object wrapper from database connection
   * @param db: sqlite3.Database
   * @return: Database
   */
  static fromDatabase(db) {
    return new this(":memory:", db);
  }

  getSlideById(id, language) {
    return new Promise((resolve, reject) => {
      const getSlideByIdQuery = `
        SELECT s.id, s.type, s.meta,
          s.content_${language} as content,
          c.name_${language} as category,
          s.note_${language} as note,
          qv.verse_${language} as verse,
          qs.name_${language} as surah,
          qv.number,
          qs.ayah,
          qs.sajda
        FROM slide s
        LEFT JOIN category c
          ON c.id = s.category
        LEFT JOIN quran_verse qv
          ON qv.id = s.verse_start
        LEFT JOIN quran_surah qs
          ON qs.id = qv.surah
        WHERE s.active = 1
          AND s.id = (?);
        `;

      database.all(getSlideByIdQuery, [id], function (err, rows) {
        if (err) {
          reject(err);
        }
        const result = !!rows && rows.length > 0 ? rows[0] : null;
        resolve(result);
      });
    });
  }

  randomVerses(count, language) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT
          qv.id,
          qv.verse_${language} as verse,
          qs.name_${language} as surah,
          qv.number,
          qs.ayah,
          qs.sajda
        FROM quran_verse qv
        LEFT JOIN quran_surah qs
          ON qs.id = qv.surah
        ORDER BY random()
        LIMIT (?)
      `;

      this.database.all(query, [count], function (err, rows) {
        if (err) {
          reject(err);
        }
        const result = !!rows && rows.length > 0 ? rows : [];
        resolve(result);
      });
    });
  }

  random(count, language, type) {
    return new Promise((resolve, reject) => {
      const typeFilter = type ? `AND s.type="${type}"` : "";
      const getRandomSlidesQuery = `
        SELECT s.id, s.type, s.meta,
          s.content_${language} as content,
          c.name_${language} as category,
          s.note_${language} as note,
          qv.verse_${language} as verse,
          qs.name_${language} as surah,
          qv.number,
          qs.ayah,
          qs.sajda
        FROM slide s
        LEFT JOIN category c
          ON c.id = s.category
        LEFT JOIN quran_verse qv
          ON qv.id = s.verse_start
        LEFT JOIN quran_surah qs
          ON qs.id = qv.surah
        WHERE (s.content_${language} IS NOT NULL OR qv.verse_${language} IS NOT NULL)
          AND s.active = 1
          ${typeFilter}
        ORDER BY random()
        LIMIT (?)
      `;

      // raw SQLite query to select from table
      this.database.all(getRandomSlidesQuery, [count], function (err, rows) {
        if (err) {
          reject(err);
        }
        const result = !!rows && rows.length > 0 ? rows : [];
        resolve(result);
      });
    });
  }

  /*
   * Returns slides matching the given category
   */
  getSlideByCategory(categoryId, language) {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT s.id, s.type, s.meta,
        s.content_${language} as content,
        c.name_${language} as category,
        s.note_${language} as note,
        qv.verse_${language} as verse,
        qs.name_${language} as surah,
        qv.number,
        qs.ayah,
        qs.sajda
      FROM slide s
      LEFT JOIN category c
        ON c.id = s.category
      LEFT JOIN quran_verse qv
        ON qv.id = s.verse_start
      LEFT JOIN quran_surah qs
        ON qs.id = qv.surah
      WHERE (s.content_${language} IS NOT NULL OR qv.verse_${language} IS NOT NULL)
        AND s.active = 1
        AND s.category = (?)
      GROUP BY s.id
      ORDER BY s.id
      `;

      this.database.all(query, [categoryId], function (err, rows) {
        if (err) {
          reject(err);
        }
        const result = !!rows && rows.length > 0 ? rows : [];
        resolve(result);
      });
    });
  }

  /*
   * Returns slides matching the given tags
   * See: http://howto.philippkeller.com/2005/04/24/Tags-Database-schemas/
   */
  q(include, exclude, orderBy, language, shouldHaveAll) {
    const order = orderBy === "random" ? "ORDER BY random()" : orderBy ? `ORDER BY ${orderBy}` : "";
    const tags = (include || []).map((t) => `"${t}"`).join(", ");
    const nTags = (exclude || []).map((t) => `"${t}"`).join(", ");
    const notInnerQ = `
      SELECT s.id
      FROM slide s,
        tags t,
        slide_tags st
      WHERE s.id = st.slide
        AND t.id = st.tag
        AND (t.name IN (${nTags}))
      GROUP BY s.id
    `;
    const notQ = !!nTags ? `AND s.id NOT IN (${notInnerQ})` : "";
    const having = shouldHaveAll ? `HAVING count(s.id) = ${include.length}` : "";

    return `
      SELECT s.id, s.type, s.meta,
        s.content_${language} as content,
        c.name_${language} as category,
        s.note_${language} as note,
        qv.verse_${language} as verse,
        qs.name_${language} as surah,
        qv.number,
        qs.ayah,
        qs.sajda
      FROM slide s,
        tags t,
        slide_tags st
      LEFT JOIN category c
        ON c.id = s.category
      LEFT JOIN quran_verse qv
        ON qv.id = s.verse_start
      LEFT JOIN quran_surah qs
        ON qs.id = qv.surah
      WHERE (s.content_${language} IS NOT NULL OR qv.verse_${language} IS NOT NULL)
        AND s.id = st.slide
        AND t.id = st.tag
        AND (t.name IN (${tags}))
        AND s.active = 1
        ${notQ}
      GROUP BY s.id
      ${having}
      ${order}
    `;
  }

  all(include, exclude, orderBy, language) {
    return new Promise((resolve, reject) => {
      const query = this.q(include, exclude, orderBy, language, true /* shouldHaveAll tags */);
      console.log(`[all] query: ${query}`);
      // raw SQLite query to select from table
      this.database.all(query, [], function (err, rows) {
        if (err) {
          reject(err);
        }
        const result = !!rows && rows.length > 0 ? rows : [];
        resolve(result);
      });
    });
  }

  any(include, exclude, orderBy, language) {
    return new Promise((resolve, reject) => {
      const query = this.q(include, exclude, orderBy, language, false /* shouldHaveAll tags */);
      console.log(`[any] query: ${query}`);
      // raw SQLite query to select from table
      this.database.all(query, [], function (err, rows) {
        if (err) {
          reject(err);
        }
        const result = !!rows && rows.length > 0 ? rows : [];
        resolve(result);
      });
    });
  }

  settings() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * from settings where active = 1";
      // raw SQLite query to select from table
      this.database.all(query, [], function (err, rows) {
        if (err) {
          reject(err);
        }
        const result = !!rows && rows.length > 0 ? rows : [];
        resolve(result);
      });
    });
  }

  getSettingByName(name) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * from settings where name = (?) AND active = 1";
      // raw SQLite query to select from table
      this.database.all(query, [name], function (err, rows) {
        if (err) {
          reject(err);
        }
        const setting = !!rows && rows.length > 0 ? rows[0] : null;
        if (!setting) {
          reject(new Error(`Unrecognized setting: ${name}`));
        }
        resolve(setting);
      });
    });
  }

  updateSetting(name, value) {
    return new Promise((resolve, reject) => {
      this.database.all("UPDATE settings SET value = (?) WHERE name = (?)", [value, name], function (err, rows) {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }
}

module.exports = { Database };
