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
    parsePage(workbook.Sheets[prop])
  }
}

function parsePage(page) {
  let newPage = {};
  let currentLabel;
  const bounds = getBounds(page["!ref"]);

  for (let key in page) {
    const num = key.match(/\d+/);

    if (num == 1) {
      currentLabel = page[key].v;
      debugger
    } else if (num) {
      debugger
      newPage[num][currentLabel] = page[key].v;
    }
  }
debugger
  return newPage
}

function getBounds(ref) {
  const str = ref.split(':').map(bound => bound.match(/[A-Z]/));
  let bounds = [];

  for (let i = str[0][0].charCodeAt(0); i <= str[1][0].charCodeAt(0); i++) {
    bounds.push(String.fromCharCode(i));
  }

  return bounds;
}
