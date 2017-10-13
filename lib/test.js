class O {
  constructor(props) {
    this.sources = {};
    this.targets = {};
  }

  genParent(parent) {
    const target = this.targets[parent.target];
    if (target && target.Source === parent.id) {
      createRibbon(data);
      // remove target.source;
    } else {
      this.sources[parent.key] = merge(parent);
    }
  }

  genChild(child) {
    const source = this.sources[child.source];

    if (source && source[child.key]) {
      createRibbon(data);
      // remove sources
    } else {
      this.targets[child.key] = merge(child);
    }
  }
}
