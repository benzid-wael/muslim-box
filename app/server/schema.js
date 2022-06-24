const path = require("path");
const graphql = require("graphql");
const sqlite3 = require("sqlite3").verbose();

const database = new sqlite3.Database(path.join(__dirname, "../../resources/muslimbox.db"));

const serializeSlide = (row) => {
    const note = (
        row.type === "quran"
        ?
        JSON.stringify({

        })
        :
        row.note
    )
    return {
        id: row.id,
        type: row.type,
        content: row.content || row.verse,
        note: note,
        meta: row.meta
    }
}

//creacte graphql slide object
const slideType = new graphql.GraphQLObjectType({
    name: "Slide",
    fields: {
        id: { type: graphql.GraphQLID },
        type: { type: graphql.GraphQLString },
        content: { type: graphql.GraphQLString },
        note: { type: graphql.GraphQLString },
        meta: { type: graphql.GraphQLString },
    }
});

// create a graphql query to select all and by id
var queryType = new graphql.GraphQLObjectType({
    name: "Query",
    fields: {
        // first query to select all
        getRandomSlides: {
            type: graphql.GraphQLList(slideType),
            args: {
                count: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt),
                },
                language: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString),
                },
            },
            resolve: (root, {count, language}, context, info) => {
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
                        ORDER BY random()
                        LIMIT (?)
                    `
                    // raw SQLite query to select from table
                    database.all(getRandomSlidesQuery, [count], function(err, rows) {
                        if(err){
                            reject([]);
                        }
                        const result = (
                            !!rows && rows.length > 0
                            ?
                            rows.map(row => serializeSlide(row))
                            :
                            []
                        )
                        resolve(result);
                    });
                });
            }
        },
        // second query to select by id
        getSlideById: {
            type: slideType,
            args:{
                id:{
                    type: new graphql.GraphQLNonNull(graphql.GraphQLID),
                },
                language: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString),
                },
            },
            resolve: (root, {id, language}, context, info) => {
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
                            reject(null);
                        }
                        const result = !!rows && rows.length > 0 ? serializeSlide(rows[0]) : null
                        resolve(result);
                    });
                });
            }
        }
    }
});

// define schema with post object, queries, and mustation
const schema = new graphql.GraphQLSchema({ query: queryType });

// export schema to use on index.js
module.exports = { schema }
