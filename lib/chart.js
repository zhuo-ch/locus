import * as Util from './util.js';

class Chart {
  constructor(props) {
    this.points = props.nodes;
    this.colors = d3.scaleOrdinal().range(d3.schemeCategory20b);
    this.x = 0;
    this.y = 0;
  }

  initialize() {
    this.data = Object.keys(this.points).map(key => { return {[key]: this.points[key]}; });
    this.getDims();
    this.setSVG();
    this.setG();
    this.render();
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
      .attr('transform', 'translate(' + (this.renderDims[0] / 2) + ',' + (this.renderDims[1] / 2) + ')');
  }

  getArc() {
    return d3.arc()
      .outerRadius(this.radius - 10)
      .innerRadius(this.radius - 70);
  }

  getPie() {
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

  getPath() {
    this.g
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
    this.getPath();
  }
}

export default Chart;
