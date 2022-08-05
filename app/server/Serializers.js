const serializeSlide = (row) => {
  const note =
    row.type === "quran"
      ? JSON.stringify({
          surah: row.surah,
          ayah: row.ayah,
          sajda: row.sajda === row.number,
        })
      : row.note;
  return {
    id: row.id,
    type: row.type,
    content: row.content || row.verse,
    category: row.category || "",
    note: note,
    meta: row.meta,
  };
};

const serializeSetting = (row) => {
  return {
    name: row.name,
    category: row.category,
    type: row.type,
    value: row.value,
    default: row.default,
    options: row.options,
  };
};

module.exports = {
  serializeSetting,
  serializeSlide,
};
