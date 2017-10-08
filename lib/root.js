import XLSX from 'xlsx';

document.addEventListener('DOMContentLoaded', () => {
  debugger
  const url = 'Locus/lib/Locus_seattle_aerospace_Sept17.xlsx';
  const req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.responseType = "arraybuffer";

  req.onload = function(e) {
    debugger
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
  for (let key in page) {
    if (key.match(/\d+/) == 11) {
      debugger
    }
  }
}
