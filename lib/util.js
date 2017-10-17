import { merge } from 'lodash';
import * as d3 from 'd3';

export const parseNodes = page => {
  let newPage = {};
  let currentLabel;
  const bounds = getBounds(page['!ref']);
  const max = bounds[bounds.length - 1];

  for (let i = 2; i <= max; i++) {
    let id;

    bounds.slice(0, bounds.length - 1).forEach(bound => {
      const key = bound + i.toString();

      if (bound === 'A') {
        id = page[key].v;
        newPage[id] = { id };
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
  nodes = createLists(nodes);

  for (let i = 2; i <= bounds[bounds.length - 1]; i++) {
      const key = bounds[0] + i.toString();

      if (edges[key]) {
        let item = createEdge(edges, bounds.slice(0, bounds.length - 1), i);
        const parent = item.Source;
        const child = item.Target;
        nodes[parent].children = nodes[parent].children.concat([item]);
        nodes[child].parents = nodes[child].parents.concat([item]);
      }
  }

  return nodes;
};

const createLists = nodes => {
  for (let node in nodes) {
    nodes[node].parents = [];
    nodes[node].children = [];
  }

  return nodes;
};

const createEdge = (edges, bounds, idx) => {
  let edge = {};

  bounds.forEach(bound => {
    const label = (edges[bound + '1'].v).trim();
    edge[label] = edges[bound + idx.toString()].v;
  });

  return edge;
};

export const createKeyList = data => {
  let keyList = {};

  data.forEach((datum, idx) => keyList[datum[Object.keys(datum)[0]].id] = idx);

  return keyList;
}

export const createMatrix = (data, keys)=> {

  let matrix = Array(data.length).fill(0).map(arr => Array(data.length).fill(0));

  for (let i = 0; i < data.length; i++) {
    const id = Object.keys(data[i])[0];

    if (data[i][id].children) {
      data[i][id].children.forEach(child => {
        matrix[i][keys[child.Target]] += 10;
      });
    }
  }

  return matrix;
};


export const getPie = () => {
  return d3.pie()
    .value((d, i) => {
      const key = Object.keys(d)[0];
      const item = d[key];
      const parents = item.parents.length > 0 ? item.parents.length : 1;
      const children = item.children.length > 0 ? item.children.length : 1;

      return parents + children;
    })
    .sort(null);
}

export const genChords = targets => {
  const chord = [];

  for (let prop in targets) {
    const target = targets[prop];

    for (let i = 0; i < target.length; i++) {
      const item = target[i];
      const chordItem = {
        source: {
          index: item.Source,
          subindex: item.Target,
          startAngle: item.startAngle,
          endAngle: item.startAngle,
          value: 10,
        },
        target: {
          index: item.Target,
          subindex: item.Source,
          startAngle: item.endAngle,
          endAngle: item.endAngle,
        }
      };

      chord.push(chordItem);
    }
  }

  chord.group = {};
  return chord;
}

export const getKey = d => {
  return Object.keys(d)[0];
}

export const getRibbon = (radius) => {
  return d3.ribbon()
    .radius(radius - 70);
}

export const getArc = (radius) => {
  return d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);
}

export const parseTextElements = d => {
  return [
    { Id: d.id },
    { Label: d.label },
    { Activity: d.Activity },
    { ['Object']: d.Object }
  ]
}
