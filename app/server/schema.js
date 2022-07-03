const path = require("path");
const graphql = require("graphql");
const sqlite3 = require("sqlite3").verbose();
const DAO = require("./DAO").DAO;

const isDev = process.env.NODE_ENV === "development";
const isMac = process.platform === "darwin";
const dbPath = (
  isDev
  ?
  path.join(__dirname, "/../../resources/muslimbox.db")
  :
  path.join(__dirname, "../../../muslimbox.db")
)
console.log(`[server] database: ${dbPath}`)
const database = new sqlite3.Database(dbPath);

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

const SearchOperatorType = new graphql.GraphQLEnumType({
  name: "SearchOperator",
  values: {
    ANY: { value: "any" },
    ALL: { value: "all" },
  }
})

const SearchOrderByType = new graphql.GraphQLEnumType({
  name: "SearchOrderBy",
  values: {
    RANDOM: { value: "random" },
    ID: { value: "id" },
  }
})

// create a graphql query to select all and by id
var queryType = new graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    // first query to get random slides
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
      resolve: async (root, {count, language}, context, info) => {
        const dao = new DAO(dbPath)
        const rows = await dao.random(count, language)
        const result = (
          !!rows && rows.length > 0
          ?
          rows.map(row => serializeSlide(row))
          :
          []
        )
        return result
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
      resolve: async (root, {id, language}, context, info) => {
        const dao = new DAO(dbPath)
        const rows = await dao.getSlideById(id, language)
        const result = !!rows && rows.length > 0 ? serializeSlide(rows[0]) : null
        return result
      }
    },
    // search for slides matching the given query
    search: {
      type: graphql.GraphQLList(slideType),
      args:{
        include: {
          type: new graphql.GraphQLList(
            new graphql.GraphQLNonNull(graphql.GraphQLString),
          ),
        },
        exclude: {
          type: new graphql.GraphQLList(
            new graphql.GraphQLNonNull(graphql.GraphQLString),
          ),
        },
        operator: {
          type: SearchOperatorType,
        },
        orderBy: {
          type: SearchOrderByType,
        },
        language: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: async (root, {include, exclude, operator, orderBy, language}, context, info) => {
        const dao = new DAO(dbPath)
        console.log(`check slides matching: ${operator} tag of ${include}`)
        let rows = []
        if (operator === "all") {
          rows = await dao.all(include, exclude, orderBy, language)
        } else if(operator === "any") {
          rows = await dao.any(include, exclude, orderBy, language)
        } else {
          throw new Error(`unsupported operator: ${operator}`)
        }
        return rows.map(row => serializeSlide(row))
      }
    },
  }
});

// define schema with post object, queries, and mustation
const schema = new graphql.GraphQLSchema({ query: queryType });

// export schema to use on index.js
module.exports = { schema }
