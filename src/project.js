window.__require=function t(e,s,i){function n(o,a){if(!s[o]){if(!e[o]){var r=o.split("/");if(r=r[r.length-1],!e[r]){var h="function"==typeof __require&&__require;if(!a&&h)return h(r,!0);if(c)return c(r,!0);throw new Error("Cannot find module '"+o+"'")}}var u=s[o]={exports:{}};e[o][0].call(u.exports,function(t){return n(e[o][1][t]||t)},u,u.exports,t,e,s,i)}return s[o].exports}for(var c="function"==typeof __require&&__require,o=0;o<i.length;o++)n(i[o]);return n}({game:[function(t,e,s){"use strict";cc._RF.push(e,"877a2bp4PFGLYA5qs95QW2C","game"),cc.Class({extends:cc.Component,properties:{sence:cc.Node,player:cc.Node,starPrefab:{default:null,type:cc.Prefab},boomPrefab:{default:null,type:cc.Prefab},destroyPrefab:{default:null,type:cc.Prefab},scoreDisplay:{default:null,type:cc.Label},lifeDisplay:{default:null,type:cc.Label},buttonDisplay:{default:null,type:cc.Button},gameOverNode:{default:null,type:cc.Node},scoreAudio:{default:null,type:cc.AudioClip},boomAudio:{default:null,type:cc.AudioClip},speed:0},onKeyDown:function(t){switch(t.keyCode){case cc.macro.KEY.a:case cc.macro.KEY.left:this.accLeft=!0;break;case cc.macro.KEY.d:case cc.macro.KEY.right:this.accRight=!0;break;case cc.macro.KEY.w:case cc.macro.KEY.up:this.playerEle.emitJump()}this.speedUpdate()},onKeyUp:function(t){switch(t.keyCode){case cc.macro.KEY.a:case cc.macro.KEY.left:this.accLeft=!1;break;case cc.macro.KEY.d:case cc.macro.KEY.right:this.accRight=!1;break;case cc.macro.KEY.w:case cc.macro.KEY.up:this.playerEle.cancelJump()}this.speedUpdate()},speedUpdate:function(){this.setSenceSpeed(),this.setPlayerSpeed()},setSenceSpeed:function(){var t=[1,.8,1.5][this.accLeft+(this.accRight+this.accRight)]||1;this.senceEle.setSpeed(this.speed*t)},setPlayerSpeed:function(){var t=[0,-1,1][this.accLeft+(this.accRight+this.accRight)]||0;this.playerEle.setSpeed(this.speed*t)},spawnDestroyAnim:function(t){var e=cc.instantiate(this.destroyPrefab);e.setPosition(t),this.node.addChild(e),e.getComponent(cc.Animation).play("starFx")},spawnNewStar:function(){var t=this,e=cc.instantiate(this.starPrefab),s=e.getComponent("star");return s.setGame(this),s.setSpeed(this.speed),s.setDestoryCallback(function(e){cc.audioEngine.playEffect(t.scoreAudio,!1),t.spawnDestroyAnim(e),t.gainScore()}),e},spawnBoom:function(){var t=this,e=cc.instantiate(this.boomPrefab),s=e.getComponent("star");return s.setGame(this),s.setSpeed(this.speed),s.setDestoryCallback(function(e){cc.audioEngine.playEffect(t.boomAudio,!1),t.spawnDestroyAnim(e),t.minusLife()}),e},startToSpawnNewStar:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;if(void 0===this._reqTemp)return this._reqTemp=e,void(this._reqId=window.requestAnimationFrame(function(e){return t.startToSpawnNewStar(e)}));if(e-this._reqTemp>=1e3){var s=[this.spawnNewStar.bind(this),this.spawnNewStar.bind(this),this.spawnNewStar.bind(this),this.spawnNewStar.bind(this),this.spawnBoom.bind(this)][parseInt(5*Math.random())]();this.node.addChild(s),this.prefabQueue.push(s),this._reqTemp=e}this._reqId=window.requestAnimationFrame(function(e){return t.startToSpawnNewStar(e)})},gainScore:function(){this.score+=1,this.scoreDisplay.string="Score: "+this.score},minusLife:function(){this.playerEle.hurtAction(),this.life-=1,this.lifeDisplay.string="Life: "+this.life,0===this.life&&this.overHandler()},startHandler:function(){this.playerEle.setEnabled(),this.senceEle.setEnabled(),this.buttonDisplay.target.active=!1,this.startToSpawnNewStar()},overHandler:function(){this.gameOverNode.active=!0,this.gameOverNode.zIndex=this.node.childrenCount,this.playerEle.setDisabled(),this.senceEle.setDisabled(),window.cancelAnimationFrame(this._reqId),this.prefabQueue.forEach(function(t){t.isValid&&t.getComponent("star").setDisabled()})},onLoad:function(){this.playerEle=this.player.getComponent("player"),this.setPlayerSpeed(),this.senceEle=this.sence.getComponent("sence"),this.setSenceSpeed(),this.score=0,this.life=3,this.accLeft=!1,this.accRight=!1,this.prefabQueue=[],cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this),cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this)},onDestroy:function(){cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this),cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this)},start:function(){},update:function(t){}}),cc._RF.pop()},{}],player:[function(t,e,s){"use strict";cc._RF.push(e,"f9d94OBr/NJOaOhOH/xV+Vu","player"),cc.Class({extends:cc.Component,properties:{jumpHeight:0,jumpDuration:0,squashDuration:0,jumpAudio:{default:null,type:cc.AudioClip}},setSquashAction:function(){var t=cc.scaleTo(this.squashDuration,1,.9),e=cc.scaleTo(this.squashDuration,1,1.1),s=cc.scaleTo(this.squashDuration,1,1);return cc.repeatForever(cc.sequence(t,e,s))},setJumpAction:function(t){var e=this,s=cc.moveBy(this.jumpDuration,cc.v2(0,this.jumpHeight)).easing(cc.easeCubicActionOut()),i=cc.moveBy(this.jumpDuration,cc.v2(0,-this.jumpHeight)).easing(cc.easeCubicActionIn()),n=cc.callFunc(t,this,null),c=cc.scaleTo(this.jumpDuration,1,1.4),o=cc.scaleTo(this.jumpDuration,1,.8),a=cc.scaleTo(this.jumpDuration,1,1),r=cc.callFunc(function(){cc.audioEngine.playEffect(e.jumpAudio,!1)},this);return cc.spawn(cc.sequence(c,o,a),cc.sequence(r,s,i,n))},hurtAction:function(){this.node.runAction(cc.blink(1,5))},emitJump:function(){this.accUp=!0},cancelJump:function(){this.accUp=!1},setSpeed:function(t){this.speed=t},setEnabled:function(){this.enabled=!0,this.squashAction=this.setSquashAction(),this.node.runAction(this.squashAction)},setDisabled:function(){this.enabled=!1,this.node.stopAllActions()},onLoad:function(){this.accUp=!1,this.isJumping=!1},start:function(){},update:function(t){this.node.x+=this.speed*t;var e=this.node.width,s=-this.node.parent.width/2+e/2,i=this.node.parent.width/2-e/2;if(this.node.x>i?this.node.x=i:this.node.x<s&&(this.node.x=s),this.accUp&&!this.isJumping){this.isJumping=!0,this.node.stopAction(this.squashAction);this.node.runAction(this.setJumpAction(function(){this.isJumping=!1,this.node.runAction(this.squashAction)}))}}}),cc._RF.pop()},{}],sence:[function(t,e,s){"use strict";cc._RF.push(e,"3aad0gl4s1Ctp72QjwSoegc","sence"),cc.Class({extends:cc.Component,properties:{bg1:cc.Node,bg2:cc.Node,ground1:cc.Node,ground2:cc.Node},setEnabled:function(){this.enabled=!0},setDisabled:function(){this.enabled=!1,this.node.stopAllActions()},onLoad:function(){this.triggerX=-this.bg1.width,this.enabled=!1},setSpeed:function(t){this.speed=t},start:function(){},update:function(t){this.bg1.x=this.ground1.x-=t*this.speed,this.bg2.x=this.ground2.x-=t*this.speed,this.bg1.x<=this.triggerX?this.bg1.x=this.ground1.x=this.bg2.x+this.bg1.width:this.bg2.x<=this.triggerX&&(this.bg2.x=this.ground2.x=this.bg1.x+this.bg1.width)}}),cc._RF.pop()},{}],starDestroy:[function(t,e,s){"use strict";cc._RF.push(e,"e42e1OyTchEDolTVf7nLFiP","starDestroy"),cc.Class({extends:cc.Component,despawn:function(){this.node.destroy()}}),cc._RF.pop()},{}],star:[function(t,e,s){"use strict";cc._RF.push(e,"5c0d1XGQkROJZ0nuE0m+Rv3","star"),cc.Class({extends:cc.Component,properties:{pickRadius:0},setGame:function(t){this.game=t},setSpeed:function(t){this.speed=.5*t},setDestoryCallback:function(t){this.destroyCallback=t},ramdomY:function(){return[60,-30,-120][parseInt(3*Math.random())]},getPlayerDistance:function(){var t=this.game.player.getPosition();return this.node.position.sub(t).mag()},setDisabled:function(){this.enabled=!1},onLoad:function(){this.node.y=this.ramdomY(),this.node.x=this.node.parent.width/2+this.node.width/2},start:function(){},update:function(t){if(this.node.x-=t*this.speed,!(this.node.x<=-this.node.parent.width/2))return this.getPlayerDistance()<this.pickRadius?(this.destroyCallback(this.node.getPosition()),void this.node.destroy()):void 0;this.node.destroy()}}),cc._RF.pop()},{}]},{},["game","player","sence","star","starDestroy"]);