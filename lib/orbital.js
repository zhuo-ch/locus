import * as Util from './util.js';

class Orbital {
  constructor(props) {
    this.points = props.nodes;
    this.x = 0;
    this.y = 0;
  }

  initialize() {
    this.getDims();
    this.setSVG();
    this.render();
  }

  setSVG() {
    const doc = document.documentElement;
    const x = doc.clientWidth - 1;
    const y = doc.clientWidth - 1;
    this.svg = d3.select('#root')
      .append('svg')
      .attr('width', this.dims[0] * 9.5 / 10)
      .attr('height', this.dims[1] * 9.5 / 10);
  }

  // setGlobe() {
  //   this.projection = d3.geoOrthographic().precision(0.1);
  //   this.graticule = d3.geoGraticule(10);
  //   this.scale();
  //   this.path = d3.geoPath(this.projection);
  //   this.svg.append('globe')
  //     .append('path')
  //     .datum({type: 'Sphere'})
  //     .attr('d', this.path)
  //     .style('stroke-width', 5)
  //     .style('stroke', 'aliceblue')
  //     .attr('opacity', 1)
  //
  //   // this.projection = d3.geoNaturalEarth1(),
  //   // this.path = d3.geoPath(this.projection);
  // }

  scale() {
    const x = this.renderDims[0], y = this.renderDims[1]
    this.projection
      .scale((0.8 * Math.min(x, y)) / 2)
      .translate([x * 2 / 5, y / 2])
      .precision(0.1);
  }

  getDims() {
    this.dims = [document.documentElement.clientWidth, document.documentElement.clientHeight];
    this.renderDims = [this.dims[0] * 3 / 4, this.dims[1] * 3 / 4];
  }

  sphere(datum) {

    return circle;
  }

  render() {
    this.svg
      .append('g')
      .selectAll('circle')
      .data(this.points)
      .enter().append('circle')
      .attr('cx', () => Util.getRand(this.renderDims[0], 10))
      .attr('cy', () => Util.getRand(this.renderDims[1], 10))
      .attr('r', () => Util.getRand(20, 5))
      .attr('fill', (d, i) => d3.schemeCategory20b[i]);
  }
}

export default Orbital;
