cc.Class({
  extends: cc.Component,

  properties: {
    // 星星和主角之间的距离小于这个数值时，就会完成收集
    pickRadius: 0
  },

  setGame(game) {
    this.game = game;
  },

  setSpeed(value) {
    this.speed = value * 0.5;
  },

  setDestoryCallback(callback) {
    this.destroyCallback = callback;
  },

  ramdomY() {
    return [60, -30, -120][parseInt(Math.random() * 3)];
  },

  getPlayerDistance() {
    // 根据 player 节点位置判断距离
    var playerPos = this.game.player.getPosition();
    // 根据两点位置计算两点之间距离
    var dist = this.node.position.sub(playerPos).mag();
    return dist;
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
    if (this.node.x <= -this.node.parent.width / 2) {
      this.node.destroy();
      return;
    }

    // 每帧判断和主角之间的距离是否小于收集距离
    if (this.getPlayerDistance() < this.pickRadius) {
      this.destroyCallback(this.node.getPosition());
      this.node.destroy();
      return;
    }
  }
});