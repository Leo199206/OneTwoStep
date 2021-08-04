import { _decorator, Component, Node, Label, director } from "cc";
import { OverPanel } from "./OverPanel";
import { Stage } from "./Stage";
const { ccclass, property } = _decorator;

@ccclass("Game")
export class Game extends Component {
  // [1]
  // dummy = '';

  // [2]
  // @property
  // serializableDummy = 0;

  @property(Stage)
  private stage: Stage | null = null;
  @property({ type: Label })
  private scoreLabel: Label | null = null;
  @property({ type: OverPanel })
  private overPanel: OverPanel | null = null;
  public score: number = 0;
  private isOver: boolean = false;

  start() {
    // [3]
    this.startGame();
  }

  /**
   * 开始游戏
   */
  public startGame() {
    this.score = 0;
    if (this.scoreLabel) {
      this.scoreLabel.string = this.score + "";
    }
    if (this.stage) {
      this.stage.init(this);
    }
  }

  /**
   * 游戏结束
   */
  public overGame() {
    console.info("game over");
    this.isOver = true;
    this.overPanel?.show(this.score);
  }

  /**
   * 累计游戏得分
   * @property score 单步游戏分数
   */
  public addScore(score: number) {
    this.score += score;
    if (this.scoreLabel) {
      this.scoreLabel.string = this.score + "";
    }
  }

  /**
   * 重新加载菜单
   */
  public returnMenu() {
    director.loadScene("menu");
  }

  /**
   * 1菜单事件
   */
  public onClickStepOne() {
    if (this.isOver) {
      return;
    }
    this.stage?.playerJump(1);
  }

  /**
   * 2菜单事件
   */
  public onClickStepTwo() {
    if (this.isOver) {
      return;
    }
    this.stage?.playerJump(2);
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
