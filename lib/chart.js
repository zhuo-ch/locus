import * as d3 from 'd3';
import * as Util from './util.js';
import { merge } from 'lodash';

class Chart {
  constructor(props) {
    this.points = props.nodes;
    this.colors = d3.scaleOrdinal().range(d3.schemeCategory20.concat(d3.schemeCategory20b).concat(d3.schemeCategory20c));
    this.x = 0;
    this.y = 0;
    this.getPie = this.getPie.bind(this);
    this.get
    this.sources = {};
    this.targets = {};
    this.counter = 0;
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
      // .datum(this.getChord()(this.matrix));
  }

  getKey(d) {
    return Object.keys(d)[0];
  }

//   getRibbon(node) {
//     const start = node.startAngle;
//     const end = node.endAngle;
//     const radius = this.radius - 70;
//     let ribbon = d3.ribbon()
//       .radius(radius)
//       .source({ startAngle: start, endAngle: start, radius })
//       .target({ startAngle: end, endAngle: end, radius });
// debugger
//     // ribbon({
//     //   source: { startAngle: start, endAngle: start, radius },
//     //   target: { startAngle: end, endAngle: end, radius },
//     // });
//
//     return ribbon;
//   }

  getRibbon() {
    return d3.ribbon()
      .radius(this.radius - 70);
  }
  // setGroup() {
  //   this.group = this.g
  //     .append('g')
  //     .attr('class', 'groups')
  // }

  // getGroup() {
  //   this.group
  //     .selectAll('donut')
  //     .data(d => this.getPie()(d.groups))
  //     .enter()
  //     .append('path')
  //     .attr('d', d => this.getArc(d))
  //     .attr('class', 'donut')
  //     .attr('id', (d, i) => 'pie' + i.toString())
  //     .style('fill', (d, i)=> this.colors(i))
  //     .style('stroke', (d, i) => this.colors(i))
  // }

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

  getChord(d, i) {
    return d3.chord()
      .padAngle(0.5);
  }

  getRibbons(d, i) {
    const data = d.data[this.getKey(d.data)];
    const children = data.children;
    const parents = data.parents;
    const angle = (d.startAngle + d.endAngle) / 2;

    children.forEach(child => this.genChildRibbon(child, angle));
    parents.forEach(parent => this.genParentRibbon(parent, angle));
  }

  genChildRibbon(child, angle) {
    child.endAngle = angle;
    const key = child.Source;
    const target = this.targets[child.Source];

    if (target !== undefined) {
      const source = target.find(el => el.Source === key);
      if (source !== undefined) {
        this.createRibbon(source);
      } else {
      }
    } else {
      // this.sources[key] = [child];
    }
    this.sources[key] = this.sources[key] !== undefined ? this.sources[key].concat([child]) : [child];
  }

  genParentRibbon(parent, angle) {
    parent.startAngle = angle;
    const key = parent.Target;
    const source = this.sources[parent.Source];
    this.targets[key] = this.targets[key] !== undefined ? this.targets[key].concat([parent]) : [parent];

    if (source !== undefined) {
      const target = source.find(el => el.Target === key);

      if (target !== undefined) {
        this.createRibbon(target);
      } else {
      }
    } else {
      // this.targets[key] = [parent] ;
    }
  }

  createRibbon(node) {
    this.counter += 1;
    // this.g
    // .selectAll('g')
    // .append('path')
    // .attr('d', this.getRibbon(node))
    // .style('fill', (d, i) => this.colors(i))
    // .style('stroke', (d, i) => this.colors(i));
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
        .attr('id', (d, i) => {
          this.getRibbons(d, i);
          return 'pie' + Object.keys(d.data)[0].toString()
        })
        .attr('fill', (d, i) => this.colors(Object.keys(d.data)[0]))
        .attr('opacity', 1)
        .on('mouseover', d => {
          const id = Object.keys(d.data)[0];
          d3.select(`#pie${id}`).style('opacity', 0.5);
          d3.selectAll('.ribbon').style('opacity', 0.1)
          d3.selectAll(`#source${id}`)
            .style('opacity', 1)
            .style('line-width', 10);
        })
        .on('mouseout', d => {
          const id = Object.keys(d.data)[0];
          d3.select(`#pie${id}`).style('opacity', 1);
          d3.selectAll('.ribbon')
            .style('opacity', 0.5)
            .style('line-width', 2);
        })
          // .append('path')
          // .attr('d', (d, i) => this.getRibbons(d,i))
          // .attr('class', 'ribbon')
          // .attr('fill', (d, i) => this.colors(Object.keys(d.data)[0]))

  }

  createChord() {
    const width = this.renderDims[0], height = this.renderDims[1];
    const colors = this.colors;

    this.g.append("g")
      .attr('class', 'chords')
      .selectAll('ribbon')
        .data(this.chords)
        .enter()
        .append("path")
        .attr("d", this.getRibbon())
        .attr('class', 'ribbon')
        .attr('id', d => 'source' + d.source.index.toString())
        .attr("fill", (d, i) => this.colors(i))
        .style('stroke', (d, i) => this.colors(i))
        .style('stroke-width', 1.5)
        .style('opacity', 0.5)
        // .style("stroke", (d, i) => this.colors[i]);
      // .append("g")
      // .attr("class", "ribbons")
      // .selectAll("path")
// debugger
    // var group = g.append("g")
    //     .attr("class", "groups")
    //   .selectAll("g")
    //   .data(function(chords) { return chords.groups; })
    //   .enter().append("g");
    //
    // group.append("path")
    //     .style("fill", (d, i) => this.colors[i])
    //     .style("stroke", (d, i) => this.colors[i])
    //     .attr("d", this.getArc());

      }

  genChords() {
    const chord = [];
    const targets = this.targets;

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
        }

        chord.push(chordItem);
      }
    }

    chord.group = {};
    this.chords = chord;
  }

  render() {
    // const x = d3.chord()(this.matrix);
    // debugger
    this.getChart();
    // this.getRibbons();
    // this.setGroup();
    // this.getGroup();

    // const total = Object.keys(this.targets).map(key => this.targets[key].length).reduce((accum, num) => accum + num);
    // const result = Object.keys(this.sources).map(key => this.sources[key].length).reduce((accum, num) => accum + num);
    this.genChords();
    this.createChord();
    // debugger
  }
}

export default Chart;
