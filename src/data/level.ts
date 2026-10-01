// Level = celé roky v produkci od ledna 2017 (start u DataLite), XP = postup k dalšímu levelu.
// Počítá se při buildu, takže se level každý rok zvedne sám.
const START = Date.UTC(2017, 0, 1);
const YEAR = 365.2425 * 24 * 3600 * 1000;
const years = (Date.now() - START) / YEAR;

export const level = Math.floor(years);
export const xp = Math.round((years - level) * 100);
