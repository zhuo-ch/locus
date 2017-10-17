import * as d3 from 'd3';

export const getRibbon = (radius) => {
  return d3.ribbon()
    .radius(radius - 70);
}

export const getArc = (radius) => {
  return d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);
}

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

export const drawChords = (g, chords, colors, radius) => {
  g.selectAll('path')
    .data(chords)
    .enter()
    .append("path")
    .attr("d", getRibbon(radius))
    .attr('class', 'ribbon')
    .attr('id', d => 'source' + d.source.index.toString())
    .style('stroke', (d, i) => colors(i))
    .style('stroke-width', 1.5)
    .style('opacity', 0.5);
}
