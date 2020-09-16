cc.Class({
  extends: cc.Component,

  properties: {
    // 跳躍高度
    jumpHeight: 0,
    // 跳躍持續時間
    jumpDuration: 0,
    // 變形時間
    squashDuration: 0,
    // 跳跃音效资源
    jumpAudio: {
      default: null,
      type: cc.AudioClip
    },
  },

  // actions
  setSquashAction() {
    // 變形動作
    var squash = cc.scaleTo(this.squashDuration, 1, 0.9);
    var stretch = cc.scaleTo(this.squashDuration, 1, 1.1);
    var scaleBack = cc.scaleTo(this.squashDuration, 1, 1);
    // cc.sequence 顺序动作可以让一系列子动作按顺序一个个執行
    return cc.repeatForever(cc.sequence(squash, stretch, scaleBack));
  },

  setJumpAction(callback) {
    // 跳躍動作
    // 上升
    var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
    // 下降
    var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
    // 跳躍完的回調
    var finished = cc.callFunc(callback, this, null);

    // 拉長
    var squash = cc.scaleTo(this.jumpDuration, 1, 1.4);
    var stretch = cc.scaleTo(this.jumpDuration, 1, 0.8);
    var scaleBack = cc.scaleTo(this.jumpDuration, 1, 1);

    // 音效
    var audioEffect = cc.callFunc(() => {
      cc.audioEngine.playEffect(this.jumpAudio, false)
    }, this)

    // cc.spawn 同步动作可以同步执行对一系列子动作，子动作的执行结果会叠加起来修改节点的属性
    return cc.spawn(
      cc.sequence(squash, stretch, scaleBack),
      cc.sequence(audioEffect, jumpUp, jumpDown, finished)
    );
  },

  hurtAction() {
    this.node.runAction(cc.blink(1, 5));
  },

  emitJump() {
    this.accUp = true;
  },

  cancelJump() {
    this.accUp = false;
  },

  setSpeed(value) {
    this.speed = value;
  },

  setEnabled() {
    this.enabled = true;
    this.squashAction = this.setSquashAction();
    this.node.runAction(this.squashAction);
  },

  setDisabled() {
    // 停止 update 運行
    this.enabled = false;

    // 停止所有行為
    this.node.stopAllActions();
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    // 移動方向开关
    this.accUp = false;

    // 跳躍行為旗標
    this.isJumping = false;
  },

  start() {},

  update(dt) {
    this.node.x += this.speed * dt;
    // 偵測邊界
    var selfWidth = this.node.width;
    var leftLimit = -this.node.parent.width / 2 + selfWidth / 2,
      rightLimit = this.node.parent.width / 2 - selfWidth / 2;
    if (this.node.x > rightLimit)
      this.node.x = rightLimit;
    else if (this.node.x < leftLimit)
      this.node.x = leftLimit;

    // 偵測跳躍
    if (this.accUp && !this.isJumping) {
      this.isJumping = true;
      this.node.stopAction(this.squashAction);
      var callback = function() {
        this.isJumping = false;
        this.node.runAction(this.squashAction);
      };
      this.node.runAction(this.setJumpAction(callback));
    }
  },
});