cc.Class({
  extends: cc.Component,

  properties: {
    // 星星和主角之间的距离小于这个数值时，就会完成收集
    pickRadius: 0,
  },

  setSpeed(value) {
    this.speed = value * 0.5;
  },

  ramdomY() {
    return [60, -30, -120][parseInt(Math.random() * 3)];
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.node.y = this.ramdomY();
    this.node.x = this.node.parent.width / 2 + (this.node.width / 2);
  },

  start() {

  },

  update(dt) {
    this.node.x -= dt * this.speed;
    if (this.node.x <= -this.node.parent.width / 2)
      this.node.destroy();
  }
});