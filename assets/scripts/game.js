cc.Class({
  extends: cc.Component,

  properties: {
    sence: cc.Node,
    player: cc.Node,
    starPrefab: {
      default: null,
      type: cc.Prefab
    },
    destroyPrefab: {
      default: null,
      type: cc.Prefab
    },
    scoreDisplay: {
      default: null,
      type: cc.Label
    },
    buttonDisplay: {
      default: null,
      type: cc.Button
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
    this.setSenceSpeed();
    this.setPlayerSpeed();
  },

  setSenceSpeed() {
    var xSpeed = ([1, 0.8, 1.5][this.accLeft + (this.accRight + this.accRight)]) || 1;
    this.senceEle.setSpeed(this.speed * xSpeed);
  },

  setPlayerSpeed() {
    var xSpeed = ([0, -1, 1][this.accLeft + (this.accRight + this.accRight)]) || 0;
    this.playerEle.setSpeed(this.speed * xSpeed);
  },

  spawnDestroyAnim(pos) {
    var anim = cc.instantiate(this.destroyPrefab);
    anim.setPosition(pos);
    this.node.addChild(anim);
    anim.getComponent(cc.Animation).play('starFx');
  },

  spawnNewStar() {
    // 使用给定的模板在场景中生成一个新节点
    var newStar = cc.instantiate(this.starPrefab);
    var star = newStar.getComponent("star");
    star.setGame(this);
    star.setSpeed(this.speed);
    star.setDestoryCallback(pos => {
      this.spawnDestroyAnim(pos);
      this.gainScore();
    });
    // 将新增的节点添加到 Canvas 节点下面
    this.node.addChild(newStar);
  },

  startToSpawnNewStar(timestamp = null) {
    if (this._reqTemp === undefined) {
      this._reqTemp = timestamp;
      window.requestAnimationFrame(t => this.startToSpawnNewStar(t));
      return;
    }

    var progress = timestamp - this._reqTemp;
    if (progress >= 1000) {
      this.spawnNewStar();
      this._reqTemp = timestamp;
    }
    window.requestAnimationFrame(t => this.startToSpawnNewStar(t));
    //    window.requestAnimationFrame(this.startToSpawnNewStar);
  },

  gainScore() {
    this.score += 1;
    // 更新 scoreDisplay Label 的文字
    this.scoreDisplay.string = 'Score: ' + this.score;
  },

  startHandler() {
    this.playerEle.setEnabled();
    this.senceEle.setEnabled();
    // 按鈕消失
    this.buttonDisplay.target.active = false;
    // 開始生產星星
    this.startToSpawnNewStar();
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    // 玩家
    this.playerEle = this.player.getComponent("player");
    this.setPlayerSpeed();

    // 場景
    this.senceEle = this.sence.getComponent("sence");
    this.setSenceSpeed();

    // 初始化計分
    this.score = 0;

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

  }
});