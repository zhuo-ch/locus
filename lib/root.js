import XLSX from 'xlsx';
import * as Util from './util.js';

document.addEventListener('DOMContentLoaded', () => {
  const url = 'Locus/lib/Locus_seattle_aerospace_Sept17.xlsx';
  const req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.responseType = "arraybuffer";

  req.onload = function(e) {
    const data = new Uint8Array(req.response);
    const workbook = XLSX.read(data, {type:"array", bookType:"xlsx"});
    const book = Util.parseBook(workbook);
    console.log(book);
  }

  req.send();
});
