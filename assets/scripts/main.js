cc.Class({
  extends: cc.Component,

  properties: {
    bg1: cc.Node,
    bg2: cc.Node,
    ground1: cc.Node,
    ground2: cc.Node,
    player: cc.Node,
    speed: 0
  },

  onKeyDown(event) {
    // set a flag when key pressed
    switch (event.keyCode) {
      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
        this.accLeft = true;
        this.playerEle.moveToLeft();
        break;
      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        this.accRight = true;
        this.playerEle.moveToRight();
        break;
      case cc.macro.KEY.w:
      case cc.macro.KEY.up:
        this.playerEle.emitJump();
        break;
    }
  },

  onKeyUp(event) {
    // unset a flag when key released
    switch (event.keyCode) {
      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
        this.accLeft = false;
        this.playerEle.cancelToLeft();
        break;
      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        this.accRight = false;
        this.playerEle.cancelToRight();
        break;
      case cc.macro.KEY.w:
      case cc.macro.KEY.up:
        this.playerEle.cancelJump();
        break;
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.playerEle = this.player.getComponent("player");
    this.playerEle.setSpeed(this.speed);

    // 初始化背景重置的觸發座標
    this.triggerX = -this.bg1.width;

    // 移動方向开关
    this.accLeft = false;
    this.accRight = false;

    // 鍵盤輸入監聽
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },

  onDestroy() {
    // 解除監聽
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },

  start() {

  },

  update(dt) {
    // 移動方向改變行進速度
    var xSpeed = ([1, 0.8, 1.5][this.accLeft + (this.accRight + this.accRight)]) || 1;
    // 背景移动
    this.bg1.x = this.ground1.x -= dt * this.speed * xSpeed;
    this.bg2.x = this.ground2.x -= dt * this.speed * xSpeed;

    // 重置
    if (this.bg1.x <= this.triggerX)
      this.bg1.x = this.ground1.x = this.bg2.x + this.bg1.width;
    else if (this.bg2.x <= this.triggerX)
      this.bg2.x = this.ground2.x = this.bg1.x + this.bg1.width;

  }
});