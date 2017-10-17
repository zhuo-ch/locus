import * as d3 from 'd3';
import * as Util from './util.js';

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

export const drawLegendCircles = (g, x, y, data) => {
  g.selectAll('circle')
    .data(data)
      .enter()
      .append('circle')
      .attr('class', 'legend')
      .attr('r', 5)
      .attr('cx', x)
      .attr('cy', (d, i) => y + (i * y))
      .style('fill', d => d[Util.getKey(d)]);
}

export const drawLegendText = (g, x, y, data) => {
  g.selectAll('text')
    .data(data)
      .enter()
      .append('text')
      .attr('class', 'legend')
      .text(d => Util.getKey(d))
      .style('fill', d => d[Util.getKey(d)])
      .attr('x', x + 15)
      .attr('y', (d, i) => y + 5 + (i * y))
      .attr('font-size', '1em');
}


export const drawList = (list, label, points) => {
  const sect = d3.select('#details')
                .append('section')
                  .append('article')
                  .attr('class', 'title')
                  .text(`${label}:`);

  sect.selectAll('article')
    .data(list)
    .enter()
    .append('article')
    .attr('class', 'info')
    .text(d => Util.getListInfo(d, label, points))
    .style('font-size', '0.3em')
    .exit()
    .remove();
}

export const drawDetails = d => {
  d3.select('#details')
    .selectAll('section')
    .data(Util.parseTextElements(d))
    .enter()
    .append('section')
    .attr('class', 'hover-title')
      .selectAll('article')
      .data(d => [Util.getKey(d), d[Util.getKey(d)]])
      .enter()
      .append('article')
        .attr('class', (d, i) => i === 0 ? 'title' : 'info')
        .text((d, i) => i === 0 ? d + ':' : d);
}

export const toggleButton = (selected, clickHandler) => {
  if (selected) {
    d3.select('#details')
      .insert('section', ':first-child')
      .append('button')
      .attr('class', 'button')
      .text('Disable Scroll Lock')
      .on('click', clickHandler);
  } else {
    d3.select('.button')
      .remove();
  }
}

export const resetChart = (id, colors) => {
  d3.select(`#pie${id}`).style('opacity', 1);

  d3.selectAll('.ribbon')
    .style('stroke-width', 1.5)
    .style('opacity', 0.5)
    .style('stroke', (d, i) => colors(i));

  d3.select('#details')
    .selectAll('section')
    .remove();

  d3.select('#details')
    .selectAll('article')
    .remove();

  d3.selectAll('.legend')
    .remove();
}

export const drawPieHover = id => {
  d3.select(`#pie${id}`).style('opacity', 0.5);
  d3.selectAll('.ribbon').style('opacity', 0.15);
}

export const drawSourceRibbons = id => {
  d3.selectAll('.ribbon')
    .filter(d => d.source.index === parseInt(id))
    .style('opacity', 1)
    .style('stroke-width', 2)
    .style('fill', 'darkorange')
    .style('stroke', 'darkorange');
}

export const drawTargetRibbons = id => {
  d3.selectAll('.ribbon')
    .filter(d => d.target.index === parseInt(id))
    .style('opacity', 1)
    .style('stroke-width', 2)
    .style('fill', 'forestgreen')
    .style('stroke', 'forestgreen');
}
