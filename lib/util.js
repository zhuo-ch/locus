import { merge } from 'lodash'

export const parseBook = workbook => {
  let book = {};

  for (let prop in workbook.Sheets) {
    book[prop] = parseNodes(workbook.Sheets[prop])
  }

  return book;
};

export const parseNodes = page => {
  let newPage = {};
  let currentLabel;
  const bounds = getBounds(page['!ref']);

  for (let i = 2; i <= bounds[bounds.length - 1]; i++) {
    let id;

    bounds.slice(0, bounds.length - 1).forEach(bound => {
      const key = bound + i.toString();

      if (bound === 'A') {
        id = page[key].v;
        newPage[id] = {};
      }
      else if (page[key]) {
        const label = page[bound + '1'].v.trim();
        newPage[id][label] = page[key].v;
      }
    });
  }

  return newPage;
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

export const getRand = (max, min) => {
  return Math.random() * (max - min) + min;
};

export const mergeNodes = (nodes, edges) => {
  const bounds = getBounds(edges['!ref']);

  for (let i = 2; i <= bounds[bounds.length - 1]; i++) {
      const key = bounds[0] + i.toString();

      if (edges[key]) {
        let item = createEdge(edges, bounds.slice(0, bounds.length - 1), i);
        const parent = item.Source;
        const child = item.Target;
        nodes[parent].children = nodes[parent].children ? nodes[parent].children.concat([item]) : [item];
        nodes[child].parent = nodes[child].parent ? nodes[child].parent.concat([item]) : [item];
      }
  }

  return nodes;
}

const createEdge = (edges, bounds, idx) => {
  let edge = {};

  bounds.forEach(bound => {
    const label = (edges[bound + '1'].v).trim();
    edge[label] = edges[bound + idx.toString()].v;
  });

  return edge;
}
