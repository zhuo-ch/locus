export const parseBook = workbook => {
  let book = {};

  for (let prop in workbook.Sheets) {
    book[prop] = parsePage(workbook.Sheets[prop])
  }

  return book;
};

const parsePage = page => {
  let newPage = {};
  let currentLabel;
  const bounds = getBounds(page["!ref"]);

  for (let i = 2; i <= bounds[bounds.length - 1]; i++) {
    newPage[i - 1] = {};
    bounds.slice(0, bounds.length - 1).forEach(bound => {
      const key = bound + i.toString();
      if (page[key]) {
        const label = page[bound + '1'].v;
        newPage[i - 1][label] = page[key].v;
      }
    });
  }

  return Object.keys(newPage).map(key => newPage[key]);
};

const getBounds = ref => {
  const str = ref.split(':').map(bound => bound.match(/[A-Z]/));
  let bounds = [];

  for (let i = str[0][0].charCodeAt(0); i <= str[1][0].charCodeAt(0); i++) {
    bounds.push(String.fromCharCode(i));
  }

  bounds.push(ref.split(':')[1].match(/\d+/)[0]);

  return bounds;
};

export const getRandLocation = (dims, center) => {
  const randX = randMax(dims[0] / 3, center[0]);
  const randY = randMax(dims[1] / 3, center[1]);

  return [randX, randY];
};

const randMax = (distance, center) => {
  return Math.random() * ((center + distance) - (center - distance)) + (center - distance);
}
