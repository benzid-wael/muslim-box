const sqlite3 = require("sqlite3").verbose();

class DAO {
  constructor(path) {
    this.path = path;
    this.database = new sqlite3.Database(path);
  }

  random(count, language) {
    return new Promise((resolve, reject) => {
      const getRandomSlidesQuery = `
        SELECT s.id, s.type, s.meta,
          s.content_${language} as content,
          s.note_${language} as note,
          qv.verse_${language} as verse,
          qs.name_${language} as surah,
          qs.ayah,
          qs.sajda
        FROM slide s
        LEFT JOIN quran_verse qv
          ON qv.id = s.verse_start
        LEFT JOIN quran_surah qs
          ON qs.id = qv.surah
        WHERE s.content_${language} IS NOT NULL
        ORDER BY random()
        LIMIT (?)
      `

      // raw SQLite query to select from table
      this.database.all(getRandomSlidesQuery, [count], function(err, rows) {
        if(err){
          reject(err);
        }
        const result = !!rows && rows.length > 0 ? rows : []
        resolve(result);
      });
    });
  }

  getSlideById(id, language) {
    return new Promise((resolve, reject) => {
      const getSlideByIdQuery = `
        SELECT s.id, s.type, s.meta,
          s.content_${language} as content,
          s.note_${language} as note,
          qv.verse_${language} as verse,
          qs.name_${language} as surah,
          qs.ayah,
          qs.sajda
        FROM slide s
        LEFT JOIN quran_verse qv
          ON qv.id = s.verse_start
        LEFT JOIN quran_surah qs
          ON qs.id = qv.surah
        WHERE s.id = (?);`

      database.all(getSlideByIdQuery, [id], function(err, rows) {
        if(err){
          reject(err);
        }
        const result = !!rows && rows.length > 0 ? rows[0] : null
        resolve(result);
      });
    });
  }

  /*
  * Returns slides matching the given tags
  * See: http://howto.philippkeller.com/2005/04/24/Tags-Database-schemas/
  */
  q(include, exclude, orderBy, language) {
    const order = (
      orderBy === "random"
      ?
      "ORDER BY random()"
      :
      orderBy ? `ORDER BY ${orderBy}` : ""
    )
    const tags = (include || []).map(t => `"${t}"`).join(", ")
    const nTags = (exclude || []).map(t => `"${t}"`).join(", ")
    const notInnerQ = `
      SELECT s.id
      FROM slide s,
        tags t,
        slide_tags st
      WHERE s.id = st.slide
        AND t.id = st.tag
        AND (t.name IN (${nTags}))
      GROUP BY s.id
    `
    const notQ = exclude ? `AND s.id NOT IN (${notInnerQ})` : ""

    return `
      SELECT s.id, s.type, s.meta,
        s.content_${language} as content,
        s.note_${language} as note,
        qv.verse_${language} as verse,
        qs.name_${language} as surah,
        qs.ayah,
        qs.sajda
      FROM slide s,
        tags t,
        slide_tags st
      LEFT JOIN quran_verse qv
        ON qv.id = s.verse_start
      LEFT JOIN quran_surah qs
        ON qs.id = qv.surah
      WHERE s.content_${language} IS NOT NULL
        AND s.id = st.slide
        AND t.id = st.tag
        AND (t.name IN (${tags}))
        ${notQ}
      GROUP BY s.id
      ${order}
    `
  }

  all(include, exclude, orderBy, language) {
    return new Promise((resolve, reject) => {
      const query = `
        ${this.q(include, exclude, orderBy, language)}
        HAVING COUNT( s.id ) = ${include.length}
      `
      // raw SQLite query to select from table
      this.database.all(query, [], function(err, rows) {
        if(err){
          reject(err);
        }
        const result = !!rows && rows.length > 0 ? rows : []
        resolve(result);
      });
    });
  }

  any(include, exclude, orderBy, language) {
    return new Promise((resolve, reject) => {
      const query = this.q(include, exclude, orderBy, language)
      // raw SQLite query to select from table
      this.database.all(query, [], function(err, rows) {
        if(err){
          reject(err);
        }
        const result = !!rows && rows.length > 0 ? rows : []
        resolve(result);
      });
    });
  }
}

module.exports = { DAO }
