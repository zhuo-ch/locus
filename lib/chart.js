import * as d3 from 'd3';
import * as Util from './util.js';

class Chart {
  constructor(props) {
    this.points = props.nodes;
    this.colors = d3.scaleOrdinal().range(d3.schemeCategory20.concat(d3.schemeCategory20b).concat(d3.schemeCategory20c));
    this.x = 0;
    this.y = 0;
    this.getPie = this.getPie.bind(this);
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
    this.setG();
    // this.setRibbon();
    // this.setGroup();
  }

  getDims() {
    this.dims = [document.documentElement.clientWidth, document.documentElement.clientHeight];
    this.renderDims = [this.dims[0] * 2 / 3, this.dims[1] * 2 / 3];
    this.radius = Math.min(this.renderDims[0], this.renderDims[1]) / 2;
  }

  setSVG() {
    const doc = document.documentElement, x = this.renderDims[0], y = this.renderDims[1];
    this.svg = d3.select('#chart')
      .append('svg')
      .attr('width', x)
      .attr('height', y);
  }

  setG() {
    this.g = this.svg
      .append('g')
      .attr('transform', 'translate(' + (this.renderDims[0] / 2) + ',' + (this.renderDims[1] / 2) + ')')
      .datum(this.getChord()(this.matrix));
  }

  getRibbon() {
    return d3.ribbon()
      .radius(this.radius - 70);
  }

  setGroup() {
    this.group = this.g
      .append('g')
      .attr('class', 'groups')
  }

  getGroup() {
    this.group
      .selectAll('donut')
      .data(d => this.getPie()(d.groups))
      .enter()
      .append('path')
      .attr('d', this.getArc())
      .attr('class', 'donut')
      .attr('id', (d, i) => 'pie' + i.toString())
      .style('fill', (d, i)=> this.colors(i))
      .style('stroke', (d, i) => this.colors(i))
  }

  getArc() {
    return d3.arc()
      .outerRadius(this.radius - 10)
      .innerRadius(this.radius - 70);
  }

  getPie() {
    return d3.pie()
      .value(d => d.value)
      .sort(null);
  }
  // getPie() {
  //   return d3.pie()
  //     .value((d, i) => {
  //       const key = Object.keys(d)[0];
  //       const item = d[key];
  //       const parents = item.parents.length > 0 ? item.parents.length : 1;
  //       const children = item.children.length > 0 ? item.children.length : 1;
  //
  //       return parents + children;
  //     })
  //     .sort(null);
  // }

  getChord() {
    return d3.chord()
      .padAngle(0.5);
  }

  getRibbons() {
    this.g
      .append('g')
      .attr('class', 'ribbons')
      .selectAll('path')
      .data(chords => chords)
        .enter()
        .append('path')
        .attr('d', this.getRibbon())
        .style('fill', (d, i) => this.colors(i))
        .style('stroke', (d, i) => this.colors(i));
  }

  getChart() {
    this.g.append('g')
      .attr('class', 'chart')
      .selectAll('donut')
      .data(this.getPie()(this.data))
      .enter()
      .append('path')
      .attr('d', this.getArc())
      .attr('class', 'donut')
      .attr('id', (d, i) => 'pie' + Object.keys(d.data)[0].toString())
      .attr('fill', (d, i) => this.colors(Object.keys(d.data)[0]));
  }

  render() {
    // this.getChart();
    this.getRibbons();
    this.setGroup();
    this.getGroup();
  }
}

export default Chart;
