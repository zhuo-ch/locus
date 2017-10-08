import XLSX from 'xlsx';

document.addEventListener('DOMContentLoaded', () => {
  debugger
  const url = 'Locus_seattle_aerospace_Sept17.xlsx';
  const req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.responseType = "arraybuffer";

  req.onload = function(e) {
    debugger
    var data = new Uint8Array(req.response);
    var workbook = XLSX.read(data, {type:"array", bookType:"xlsx"});
    console.log(workbook);
    debugger
  }

  req.send();
});
