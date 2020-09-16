cc.Class({
  extends: cc.Component,

  properties: {
    sence: cc.Node,
    player: cc.Node,
    starPrefab: {
      default: null,
      type: cc.Prefab
    },
    boomPrefab: {
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
    lifeDisplay: {
      default: null,
      type: cc.Label
    },
    buttonDisplay: {
      default: null,
      type: cc.Button
    },
    gameOverNode: {
      default: null,
      type: cc.Node
    },
    scoreAudio: {
      default: null,
      type: cc.AudioClip
    },
    boomAudio: {
      default: null,
      type: cc.AudioClip
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
      cc.audioEngine.playEffect(this.scoreAudio, false);
      this.spawnDestroyAnim(pos);
      this.gainScore();
    });
    return newStar;
  },

  spawnBoom() {
    var newBoom = cc.instantiate(this.boomPrefab);
    // getComponent(腳本名稱)
    var boom = newBoom.getComponent("star");
    boom.setGame(this);
    boom.setSpeed(this.speed);
    boom.setDestoryCallback(pos => {
      cc.audioEngine.playEffect(this.boomAudio, false);
      this.spawnDestroyAnim(pos);
      this.minusLife();
    });
    return newBoom;
  },

  startToSpawnNewStar(timestamp = null) {
    if (this._reqTemp === undefined) {
      this._reqTemp = timestamp;
      this._reqId = window.requestAnimationFrame(t => this.startToSpawnNewStar(t));
      return;
    }

    var progress = timestamp - this._reqTemp;
    if (progress >= 1000) {
      const newPrefab = [
        this.spawnNewStar.bind(this),
        this.spawnNewStar.bind(this),
        this.spawnNewStar.bind(this),
        this.spawnNewStar.bind(this),
        this.spawnBoom.bind(this)
      ][
        parseInt(Math.random() * 5)
      ]();
      // 将新增的节点添加到 Canvas 节点下面
      this.node.addChild(newPrefab);
      this.prefabQueue.push(newPrefab);
      this._reqTemp = timestamp;
    }
    this._reqId = window.requestAnimationFrame(t => this.startToSpawnNewStar(t));
  },

  gainScore() {
    this.score += 1;
    // 更新 scoreDisplay Label 的文字
    this.scoreDisplay.string = 'Score: ' + this.score;
  },

  minusLife() {
    this.playerEle.hurtAction();
    this.life -= 1;
    this.lifeDisplay.string = 'Life: ' + this.life;
    if (this.life === 0)
      this.overHandler();
  },

  startHandler() {
    this.playerEle.setEnabled();
    this.senceEle.setEnabled();
    // 按鈕消失
    this.buttonDisplay.target.active = false;
    // 開始生產星星
    this.startToSpawnNewStar();
  },

  overHandler() {
    this.gameOverNode.active = true;
    this.gameOverNode.zIndex = this.node.childrenCount;
    this.playerEle.setDisabled();
    this.senceEle.setDisabled();
    window.cancelAnimationFrame(this._reqId);
    this.prefabQueue.forEach(prefab => {
      if (prefab.isValid)
        prefab.getComponent("star").setDisabled()
    });
    // 一切重新開始
    // cc.director.loadScene('game');
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

    // 初始化生命
    this.life = 3;

    // 移動方向开关
    this.accLeft = false;
    this.accRight = false;

    // 暫存佇列
    this.prefabQueue = [];

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