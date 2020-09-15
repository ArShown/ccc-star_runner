cc.Class({
  extends: cc.Component,

  despawn() {
    this.node.destroy();
  }
});