import XLSX from 'xlsx';
import * as Util from './util.js';
import Chart from './chart.js';

document.addEventListener('DOMContentLoaded', () => {
  const url = 'lib/Locus_seattle_aerospace_Sept17.xlsx';
  const req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.responseType = "arraybuffer";

  req.onload = function(e) {
    const data = new Uint8Array(req.response);
    const workbook = XLSX.read(data, {type:"array", bookType:"xlsx"}).Sheets;
    let nodes = Util.parseNodes(workbook['Locus_aerospace_nodes']);
    nodes = Util.mergeNodes(nodes, workbook['Locus_aerospace_edges']);
    const chart = new Chart({ nodes });
    chart.initialize();
  }

  req.send();
});
