import {
  _decorator,
  Component,
  Node,
  Prefab,
  Vec3,
  instantiate,
  tween,
} from "cc";
import { Block } from "./Block";
import { Game } from "./Game";
import { OverPanel } from "./OverPanel";
import { Player } from "./Player";
const { ccclass, property } = _decorator;

@ccclass("Stage")
export class Stage extends Component {
  @property({ type: Player })
  private player: Player | null = null;
  @property({ type: Prefab })
  private blockPrefab: Node | null = null;
  private game: Game | null = null;
  @property({ type: Number })
  private stepDistance: number = 200;
  @property({ type: Number })
  @property({ type: Number })
  private jumpHeight: number = 100;
  @property({ type: Number })
  private jumpDuration: number = 0.3;
  @property({ type: Number })
  private fallHeight: number = 500;
  @property({ type: Number })
  private fallDuration: number = 0.5;
  @property({ type: Number })
  private initStayDuration: number = 2;
  @property({ type: Number })
  private minStayDuration: number = 0.3;
  @property({ type: Number })
  private speed: number = 0.1;
  private stayDuration: number = 0;
  private blockList: Array<Block> = [];
  private lastBlock: boolean = true;
  private lastBlockX: number = 0;

  /**
   * Game引用初始化傳入
   */
  public init(game: Game) {
    this.game = game;
    this.lastBlockX = -430;
    this.stayDuration = this.initStayDuration;
    this.player?.init(
      this.stepDistance,
      this.jumpHeight,
      this.jumpDuration,
      this.fallDuration,
      this.fallHeight
    );
    this.addBlock(new Vec3(this.lastBlockX, -280));
    for (var i = 0; i < 10; i++) {
      this.randomAddBlock();
    }
  }

  /**
   * 随机生成跑道
   */
  private randomAddBlock() {
    this.lastBlockX = this.lastBlockX + this.stepDistance;
    if (!this.lastBlock || Math.random() > 0.5) {
      this.addBlock(new Vec3(this.lastBlockX, -280));
    } else {
      this.addBlank();
    }
  }

  /**
   * 添加跑道
   */
  private addBlock(v3: Vec3) {
    var blockNote = instantiate(this.blockPrefab);
    if (blockNote != null) {
      blockNote.position = v3;
      this.node.addChild(blockNote);
      this.blockList.push(blockNote.getComponent(Block)!);
      this.lastBlock = true;
    }
  }

  /**
   * 移动跑道
   */
  private moveStage(step: number) {
    tween(this.node)
      .by(this.jumpDuration, {
        position: new Vec3(-this.stepDistance * step, 0),
      })
      .start();
    for (var i = 0; i < step; i++) {
      this.randomAddBlock();
    }
  }

  /**
   * 添加坑
   */
  private addBlank() {
    this.blockList.push(null!);
    this.lastBlock = false;
  }

  /**
   * 控制跳跃操作
   */
  public playerJump(step: number) {
    console.info("playerJump step=" + step);
    if (!this.player || !this.player.canJump) {
      return;
    }
    this.moveStage(step);
    this.player.jump(step, () => {
      this.jumpEnd(step);
    });
  }

  /**
   * 跳跃动画结束
   */
  private jumpEnd(step: number) {
    let blockIndex = this.player!.index;
    let isOver = !this.hasBlock(blockIndex);
    if (isOver) {
      this.player
        ?.getSinkingTween()
        .call(() => {
          this.game?.overGame();
          this.player?.playDieAudio();
        })
        .start();
    } else {
      let block = this.blockList[blockIndex];
      block?.init(
        this.fallDuration,
        this.fallHeight,
        this.stayDuration,
        this.callOverGame(blockIndex)
      );
      this.game?.addScore(step == 1 ? 1 : 3);
    }
    if (blockIndex % 10 === 0) {
      this.changeSpeed();
    }
  }

  /**
   * 判断游戏是否结束
   */
  private callOverGame(blockIndex: number): Function {
    return (block: Block) => {
      if (blockIndex === this.player?.index) {
        console.info("callOverGame");
        let playerTween = this.player!.getSinkingTween();
        let blockTween = block.getSinkingTween();
         this.player?.playDieAudio();
        blockTween.start();
        playerTween
          .call(() => {
            this.game?.overGame();
          })
          .start();
      }
    };
  }

  /**
   * 判断游戏是否结束
   */
  public hasBlock(index: number): boolean {
    return this.blockList[index] instanceof Block;
  }

  /**
   * 改变允许停留时间
   */
  private changeSpeed() {
    this.stayDuration -= this.speed;
    if (this.stayDuration <= this.minStayDuration) {
      this.stayDuration = this.minStayDuration;
    }
  }

  // [1]
  // dummy = '';

  // [2]`
  // @property
  // serializableDummy = 0;

  start() {
    // [3]
  }

  // update (deltaTime: number) {
  //     // [4]
  // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
