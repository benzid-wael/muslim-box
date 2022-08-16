const path = require("path");
const graphql = require("graphql");
const sqlite3 = require("sqlite3").verbose();
const Database = require("./Database").Database;
const Repository = require("./Repository");

const isDev = process.env.NODE_ENV === "development";
const isMac = process.platform === "darwin";
const dbPath = isDev
  ? path.join(__dirname, "/../../resources/muslimbox.db")
  : path.join(__dirname, "../../../muslimbox.db");
console.log(`[server] database: ${dbPath}`);
// const database = new sqlite3.Database(dbPath);

const Setting = new graphql.GraphQLObjectType({
  name: "Setting",
  fields: {
    name: { type: graphql.GraphQLString },
    category: { type: graphql.GraphQLString },
    type: { type: graphql.GraphQLString },
    value: { type: graphql.GraphQLString },
    default: { type: graphql.GraphQLString },
    options: { type: graphql.GraphQLString },
  },
});

// creacte graphql slide object
const Slide = new graphql.GraphQLObjectType({
  name: "Slide",
  fields: {
    id: { type: graphql.GraphQLID },
    type: { type: graphql.GraphQLString },
    content: { type: graphql.GraphQLString },
    category: { type: graphql.GraphQLString },
    note: { type: graphql.GraphQLString },
    meta: { type: graphql.GraphQLString },
  },
});

const SlideTypeEnum = new graphql.GraphQLEnumType({
  name: "SlideType",
  values: {
    QURAN: { value: "quran" },
    HADITH: { value: "hadith" },
    DHIKR: { value: "dhikr" },
    ATHAR: { value: "athar" },
  },
});

const SearchOperatorEnum = new graphql.GraphQLEnumType({
  name: "SearchOperator",
  values: {
    ANY: { value: "any" },
    ALL: { value: "all" },
  },
});

const SearchOrderByEnum = new graphql.GraphQLEnumType({
  name: "SearchOrderBy",
  values: {
    RANDOM: { value: "random" },
    ID: { value: "id" },
  },
});

// create a graphql query to select all and by id
const queryType = new graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    settings: {
      type: graphql.GraphQLList(Setting),
      resolve: async (root, args, context, info) => {
        const db = new Database(dbPath);
        const result = await Repository.settings(db);
        return result;
      },
    },
    getSettingByName: {
      type: Setting,
      args: {
        name: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: async (root, { name }, context, info) => {
        const db = new Database(dbPath);
        const result = await Repository.getSettingByName(db, name);
        return result;
      },
    },
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
      resolve: async (root, { count, language }, context, info) => {
        const db = new Database(dbPath);
        const result = await Repository.versesOfTheDay(db, count, language);
        return result;
      },
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
      resolve: async (root, { count, language, type }, context, info) => {
        const db = new Database(dbPath);
        const result = await Repository.random(db, count, language, type);
        return result;
      },
    },
    // second query to select by id
    getSlideById: {
      type: Slide,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLID),
        },
        language: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: async (root, { id, language }, context, info) => {
        const db = new Database(dbPath);
        const result = await Repository.getSlideById(db, id, language);
        return result;
      },
    },
    // search for slides matching the given query
    slideCategory: {
      type: graphql.GraphQLList(Slide),
      args: {
        id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLID),
        },
        language: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: async (root, { id, language }, context, info) => {
        const db = new Database(dbPath);
        const result = await Repository.getSlideByCategory(db, id, language);
        return result;
      },
    },
    search: {
      type: graphql.GraphQLList(Slide),
      args: {
        include: {
          type: new graphql.GraphQLList(new graphql.GraphQLNonNull(graphql.GraphQLString)),
        },
        exclude: {
          type: new graphql.GraphQLList(new graphql.GraphQLNonNull(graphql.GraphQLString)),
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
      resolve: async (root, { include, exclude, operator, orderBy, language }, context, info) => {
        const db = new Database(dbPath);
        const result = await Repository.search(db, operator, include, exclude, orderBy, language);
        return result;
      },
    },
  },
});

const mutationType = new graphql.GraphQLObjectType({
  name: "Mutation",
  fields: {
    updateSetting: {
      type: Setting,
      args: {
        name: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        value: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
      },
      resolve: async (root, { name, value }, context, info) => {
        const db = new Database(dbPath);
        const result = await Repository.updateSetting(db, name, value);
        return result;
      },
    },
    unsetSettings: {
      type: graphql.GraphQLList(Setting),
      args: {
        settings: {
          type: new graphql.GraphQLList(graphql.GraphQLString),
        },
      },
      resolve: async (root, { settings }, context, info) => {
        const db = new Database(dbPath);
        const result = await Repository.unsetSettings(db, settings);
        return result;
      },
    },
  },
});

// define schema with post object, queries, and mustation
const schema = new graphql.GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

// export schema to use on index.js
module.exports = { schema };
