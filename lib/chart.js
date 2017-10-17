import * as d3 from 'd3';
import * as Util from './util.js';
import * as DrawUtil from './draw_util.js';
import { merge } from 'lodash';

class Chart {
  constructor(props) {
    this.points = props.nodes;
    this.colors = d3.scaleOrdinal().range(d3.schemeCategory20.concat(d3.schemeCategory20b).concat(d3.schemeCategory20c));
    this.x = 0;
    this.y = 0;
    this.get
    this.sources = {};
    this.targets = {};
    this.targeted = false;
    this.legend = [{ Target: '#FF8C00' }, { Source: '#228B22' }];
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setPieId = this.setPieId.bind(this);
    this.filterTargetRibbons = this.filterTargetRibbons.bind(this);
    this.filterSourceRibbons = this.filterSourceRibbons.bind(this);
  }

  initialize() {
    this.initializeData();
    this.initializeSVG();
    this.render();
  }

  initializeData() {
    this.data = Object.keys(this.points).map(key => { return {[key]: this.points[key]}; });
    this.keyList = Util.createKeyList(this.data);
    this.matrix = Util.createMatrix(this.data, this.keyList);
  }

  initializeSVG() {
    this.getDims();
    this.setSVG();
  }

  handleMouseOver(d) {
    const id = Util.getKey(d.data);
    this.sourceId = id;

    d3.select(`#pie${id}`).style('opacity', 0.5);
    d3.selectAll('.ribbon').style('opacity', 0.15);

    d3.selectAll('.ribbon')
      .filter(d => this.filterTargetRibbons(d))
      .style('opacity', 1)
      .style('stroke-width', 2)
      .style('fill', 'forestgreen')
      .style('stroke', 'forestgreen');

    d3.selectAll('.ribbon')
      .filter(d => this.filterSourceRibbons(d))
      .style('opacity', 1)
      .style('stroke-width', 2)
      .style('fill', 'darkorange')
      .style('stroke', 'darkorange');

    this.getTextSections(d.data[id]);
    this.getLegend();
  }

  handleMouseOut(d) {
    const id = Util.getKey(d.data);

    d3.select(`#pie${id}`).style('opacity', 1);
    d3.selectAll('.ribbon')
      .style('stroke-width', 1.5)
      .style('opacity', 0.5)
      .style('stroke', (d, i) => this.colors(i));
    d3.select('#details')
      .selectAll('section')
      .remove();
    d3.select('#details')
      .selectAll('article')
      .remove();
    d3.selectAll('.legend')
      .remove();
  }

  handleClick() {
    this.selected = this.selected ? false : true;

    if (this.selected) {
      d3.select('#details')
        .insert('section', ':first-child')
        .append('button')
        .attr('class', 'button')
        .text('Disable Scroll Lock')
        .on('click', this.handleClick);
    } else {
      d3.select('.button')
        .remove();
    }
  }

  filterTargetRibbons(d) {
    return d.target.index === parseInt(this.sourceId);
  }

  filterSourceRibbons(d) {
    return d.source.index === parseInt(this.sourceId);
  }

  getTextSections(d) {
    DrawUtil.drawDetails(d);
    DrawUtil.drawList(d.parents, 'Sources', this.points);
    DrawUtil.drawList(d.children, 'Targets', this.points);
  }

  setPieId(d, i) {
    this.getRibbons(d, i);
    return 'pie' + Object.keys(d.data)[0].toString();
  }

  getDims() {
    this.dims = [document.documentElement.clientWidth, document.documentElement.clientHeight];
    this.renderDims = [this.dims[0] * 2 / 3, this.dims[1] * 4 / 5];
    this.radius = Math.min(this.renderDims[0], this.renderDims[1]) / 2;
  }

  setSVG() {
    const x = this.renderDims[0], y = this.renderDims[1];
    this.svg = d3.select('#chart')
      .append('svg')
      .attr('width', x)
      .attr('height', y);
  }

  setG() {
    this.g = this.svg
      .append('g')
      .attr('width', this.renderDims[0])
      .attr('height', this.renderDims[1]);
  }

  getRibbons(d, i) {
    const data = d.data[Util.getKey(d.data)];
    const children = data.children;
    const parents = data.parents;
    const angle = (d.startAngle + d.endAngle) / 2;

    children.forEach(child => this.genChildRibbon(child, angle));
    parents.forEach(parent => this.genParentRibbon(parent, angle));
  }

  genChildRibbon(child, angle) {
    child.endAngle = angle;
    const key = child.Source;
    this.sources[key] = this.sources[key] !== undefined ? this.sources[key].concat([child]) : [child];
  }

  genParentRibbon(parent, angle) {
    parent.startAngle = angle;
    const key = parent.Target;
    this.targets[key] = this.targets[key] !== undefined ? this.targets[key].concat([parent]) : [parent];
  }


  getChart() {
    this.svg.append('g')
      .attr('class', 'chart')
      .attr('transform', 'translate(' + (this.renderDims[0] / 2) + ',' + (this.renderDims[1] / 2) + ')')
      .selectAll('path')
      .data(DrawUtil.getPie()(this.data))
        .enter()
        .append('path')
        .attr('d', DrawUtil.getArc(this.radius))
        .attr('class', 'donut')
        .attr('id', (d, i) => this.setPieId(d, i))
        .attr('fill', (d, i) => this.colors(Object.keys(d.data)[0]))
        .attr('opacity', 1)
        .on('click', this.handleClick )
        .on('mouseover', d => this.selected ? '' : this.handleMouseOver(d))
        .on('mouseout', d => this.selected ? '' : this.handleMouseOut(d));
  }

  getChord() {
    const width = this.renderDims[0], height = this.renderDims[1];
    const g = this.svg.append("g")
      .attr('class', 'chords')
      .attr('transform', 'translate(' + (this.renderDims[0] / 2) + ',' + (this.renderDims[1] / 2) + ')');

    DrawUtil.drawChords(g, this.chords, this.colors, this.radius);
  }

  getLegend() {
    const x = 20, y = 20;
    const g = this.svg
      .append('g');

    DrawUtil.drawLegendCircles(g, x, y, this.legend);
    DrawUtil.drawLegendText(g, x, y, this.legend);
  }

  render() {
    this.getChart();
    this.chords = Util.genChords(this.targets);
    this.getChord();
  }
}

export default Chart;
