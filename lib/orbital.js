import * as Util from './util.js';

class Orbital {
  constructor(props) {
    this.points = props.points;
    this.x = 0;
    this.y = 0;
  }

  initialize() {
    this.setSVG();
    this.getDims();
    this.render();
    // this.setGlobe();
  }

  setSVG() {
    const doc = document.documentElement;
    const x = doc.clientWidth - 1;
    const y = doc.clientWidth - 1;
    this.svg = d3
      .select('#root')
      .append('svg')
      .attr('width', x)
      .attr('height', y)
      .append('g')
  }

  // setGlobe() {
  //   this.globe = d3.geoOrthographic().precision(0.1);
  //   this.grat = d3.geoGraticule10();
  //   this.path = d3.geoPath(this.globe).context(this.context);
  //   this.scale();
  // }

  // scale() {
  //
  //   this.globe
  //     .scale((0.8 * Math.min(x, y)) / 2)
  //     .translate([x * 2 / 5, y / 2]);
  // }

  getDims() {
    this.dims = [document.documentElement.clientWidth, document.documentElement.clientHeight];
    this.renderDims = [this.dims[0] * 3 / 4, this.dims[1] * 3 / 4];
  }

  sphere(datum) {


    return circle;
  }

  render() {
    d3.select('g')
      .selectAll('circle')
      .data(this.points)
      .enter().append('circle')
      .attr('cx', () => Math.random() * (this.renderDims[0] - 1) + 1)
      .attr('cy', () => Math.random() * (this.renderDims[1] - 1) + 1)
      .attr('r', () => Math.random() * (4 - 1) + 1)
      .attr('fill', (d, i) => d3.schemeCategory20[i]);
  }
}

export default Orbital;
