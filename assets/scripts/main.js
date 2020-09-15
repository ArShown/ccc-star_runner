cc.Class({
  extends: cc.Component,

  properties: {
    bg1: cc.Node,
    bg2: cc.Node,
    ground1: cc.Node,
    ground2: cc.Node,
    player: cc.Node,
    starPrefab: {
      default: null,
      type: cc.Prefab
    },
    speed: 0
  },

  onKeyDown(event) {
    // set a flag when key pressed
    switch (event.keyCode) {
      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
        this.accLeft = true;
        break;
      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        this.accRight = true;
        break;
      case cc.macro.KEY.w:
      case cc.macro.KEY.up:
        this.playerEle.emitJump();
        break;
    }
    this.speedUpdate();
  },

  onKeyUp(event) {
    // unset a flag when key released
    switch (event.keyCode) {
      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
        this.accLeft = false;
        break;
      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        this.accRight = false;
        break;
      case cc.macro.KEY.w:
      case cc.macro.KEY.up:
        this.playerEle.cancelJump();
        break;
    }
    this.speedUpdate();
  },

  speedUpdate() {
    // 移動方向改變行進速度
    this.xSpeed = ([1, 0.8, 1.5][this.accLeft + (this.accRight + this.accRight)]) || 1;
    this.setPlayerSpeed();
    this.setStarSpeed();
  },

  setPlayerSpeed() {
    var xSpeed = ([0, -1, 1][this.accLeft + (this.accRight + this.accRight)]) || 0;
    this.playerEle.setSpeed(this.speed * xSpeed);
  },

  setStarSpeed() {
    var xSpeed = ([1, 0.8, 1.5][this.accLeft + (this.accRight + this.accRight)]) || 1;
    var sp = this.speed * xSpeed;
    this.starStorage
      .filter(star => star.isValid)
      .forEach(star => star.setSpeed(sp));
  },

  spawnNewStar() {
    // 使用给定的模板在场景中生成一个新节点
    var newStar = cc.instantiate(this.starPrefab);
    var star = newStar.getComponent("star");
    // keep
    this.starStorage.push(star);
    // 統一速度
    this.setStarSpeed();
    // 将新增的节点添加到 Canvas 节点下面
    this.node.addChild(newStar);
  },

  startToSpawnNewStar() {
    var refreshIntervalId = setInterval(() => {
      this.spawnNewStar();
    }, 1000);
    //clearInterval(refreshIntervalId)
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    // 玩家
    this.playerEle = this.player.getComponent("player");
    this.setPlayerSpeed();

    // 初始化背景重置的觸發座標
    this.triggerX = -this.bg1.width;
    // 初始化加速參數
    this.xSpeed = 1;

    // star prefab 容器
    this.starStorage = [];

    // 移動方向开关
    this.accLeft = false;
    this.accRight = false;

    // 開始生產星星
    this.startToSpawnNewStar();

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
    // 背景移动
    this.bg1.x = this.ground1.x -= dt * this.speed * this.xSpeed;
    this.bg2.x = this.ground2.x -= dt * this.speed * this.xSpeed;

    // 重置
    if (this.bg1.x <= this.triggerX)
      this.bg1.x = this.ground1.x = this.bg2.x + this.bg1.width;
    else if (this.bg2.x <= this.triggerX)
      this.bg2.x = this.ground2.x = this.bg1.x + this.bg1.width;

  }
});