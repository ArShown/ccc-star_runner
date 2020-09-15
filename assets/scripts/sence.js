cc.Class({
  extends: cc.Component,

  properties: {
    bg1: cc.Node,
    bg2: cc.Node,
    ground1: cc.Node,
    ground2: cc.Node,
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    // 初始化背景重置的觸發座標
    this.triggerX = -this.bg1.width;
  },

  setSpeed(value) {
    this.speed = value;
  },

  start() {

  },

  update(dt) {
    // 背景移动
    this.bg1.x = this.ground1.x -= dt * this.speed;
    this.bg2.x = this.ground2.x -= dt * this.speed;

    // 重置
    if (this.bg1.x <= this.triggerX)
      this.bg1.x = this.ground1.x = this.bg2.x + this.bg1.width;
    else if (this.bg2.x <= this.triggerX)
      this.bg2.x = this.ground2.x = this.bg1.x + this.bg1.width;

  },
});