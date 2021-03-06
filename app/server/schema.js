const path = require("path");
const graphql = require("graphql");
const sqlite3 = require("sqlite3").verbose();
const Database = require("./Database").Database;
const Repository = require("./Repository");

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
// const database = new sqlite3.Database(dbPath);

//creacte graphql slide object
const Slide = new graphql.GraphQLObjectType({
  name: "Slide",
  fields: {
    id: { type: graphql.GraphQLID },
    type: { type: graphql.GraphQLString },
    content: { type: graphql.GraphQLString },
    category: { type: graphql.GraphQLString },
    note: { type: graphql.GraphQLString },
    meta: { type: graphql.GraphQLString },
  }
});

const SlideTypeEnum = new graphql.GraphQLEnumType({
  name: "SlideType",
  values: {
    QURAN: { value: "quran" },
    HADITH: { value: "hadith" },
    DHIKR: { value: "dhikr" },
    ATHAR: { value: "athar" },
  }
})

const SearchOperatorEnum = new graphql.GraphQLEnumType({
  name: "SearchOperator",
  values: {
    ANY: { value: "any" },
    ALL: { value: "all" },
  }
})

const SearchOrderByEnum = new graphql.GraphQLEnumType({
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
    versesOfTheDay: {
      type: graphql.GraphQLList(Slide),
      args: {
        count: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLInt),
        },
        language: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: async (root, {count, language}, context, info) => {
        const db = new Database(dbPath)
        const result = await Repository.versesOfTheDay(db, count, language)
        return result
      }
    },
    // get random slides
    random: {
      type: graphql.GraphQLList(Slide),
      args: {
        count: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLInt),
        },
        language: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        type: {
          type: SlideTypeEnum,
        },
      },
      resolve: async (root, {count, language, type}, context, info) => {
        const db = new Database(dbPath)
        const result = await Repository.random(db, count, language, type)
        return result
      }
    },
    // second query to select by id
    getSlideById: {
      type: Slide,
      args:{
        id:{
          type: new graphql.GraphQLNonNull(graphql.GraphQLID),
        },
        language: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: async (root, {id, language}, context, info) => {
        const db = new Database(dbPath)
        const result = await Repository.getSlideById(db, id, language)
        return result
      }
    },
    // search for slides matching the given query
    slideCategory: {
      type: graphql.GraphQLList(Slide),
      args: {
        id:{
          type: new graphql.GraphQLNonNull(graphql.GraphQLID),
        },
        language: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: async (root, {id, language}, context, info) => {
        const db = new Database(dbPath)
        const result = await Repository.getSlideByCategory(db, id, language)
        return result
      }
    },
    search: {
      type: graphql.GraphQLList(Slide),
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
          type: SearchOperatorEnum,
        },
        orderBy: {
          type: SearchOrderByEnum,
        },
        language: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: async (root, {include, exclude, operator, orderBy, language}, context, info) => {
        const db = new Database(dbPath)
        const result = await Repository.search(db, operator, include, exclude, orderBy, language)
        return result
      }
    },
  }
});

// define schema with post object, queries, and mustation
const schema = new graphql.GraphQLSchema({ query: queryType });

// export schema to use on index.js
module.exports = { schema }
