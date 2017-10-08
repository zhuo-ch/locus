import XLSX from 'xlsx';

document.addEventListener('DOMContentLoaded', () => {
  const url = 'Locus/lib/Locus_seattle_aerospace_Sept17.xlsx';
  const req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.responseType = "arraybuffer";

  req.onload = function(e) {
    var data = new Uint8Array(req.response);
    var workbook = XLSX.read(data, {type:"array", bookType:"xlsx"});
    parseBook(workbook)
    console.log(workbook);
  }

  req.send();
});

function parseBook(workbook) {
  let book = {};

  for (let prop in workbook.Sheets) {
    book[prop] = parsePage(workbook.Sheets[prop])
  }

  return book;
}

function parsePage(page) {
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

  return newPage
}

function getBounds(ref) {
  const str = ref.split(':').map(bound => bound.match(/[A-Z]/));
  let bounds = [];

  for (let i = str[0][0].charCodeAt(0); i <= str[1][0].charCodeAt(0); i++) {
    bounds.push(String.fromCharCode(i));
  }

  bounds.push(ref.split(':')[1].match(/\d+/)[0]);

  return bounds;
}
