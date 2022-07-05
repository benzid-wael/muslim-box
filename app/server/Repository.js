const serializeSlide = (row) => {
  const note = (
    row.type === "quran"
    ?
    JSON.stringify({
      surah: row.surah,
      ayah: row.ayah,
      sajda: row.sajda === row.number
    })
    :
    row.note
  )
  return {
    id: row.id,
    type: row.type,
    content: row.content || row.verse,
    category: row.category || "",
    note: note,
    meta: row.meta
  }
}

const versesOfTheDay = async (db, count, language) => {
  const rows = await db.randomVerses(count, language)
  const result = (
    !!rows && rows.length > 0
    ?
    rows.map(row => {
      const note = JSON.stringify({
        surah: row.surah,
        number: row.number,
        ayah: row.ayah,
        sajda: row.sajda === row.number
      })
      return {
        id: row.id,
        type: "quran",
        content: row.verse,
        category: "",
        note: note,
        meta: ""
      }
    })
    :
    []
  )
  return result
}

const random = async (db, count, language, type) => {
  // const db = new Database(path)
  const rows = await db.random(count, language, type)
  const result = (
    !!rows && rows.length > 0
    ?
    rows.map(row => serializeSlide(row))
    :
    []
  )
  return result
}

const getSlideById = async (db, id, language) => {
  const rows = await db.getSlideById(id, language)
  const result = !!rows && rows.length > 0 ? serializeSlide(rows[0]) : null
  return result
}

const search = async (db, operator, include, exclude, orderBy, language) => {
  console.log(`check slides matching: ${operator} tag of ${include}`)
  let rows = []
  if (operator === "all") {
    rows = await db.all(include, exclude, orderBy, language)
  } else if(operator === "any") {
    rows = await db.any(include, exclude, orderBy, language)
  } else {
    throw new Error(`unsupported operator: ${operator}`)
  }
  return rows.map(row => serializeSlide(row))
}

module.exports = {
  versesOfTheDay,
  random,
  getSlideById,
  search
}
