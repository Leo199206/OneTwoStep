import {
  _decorator,
  Component,
  Node,
  Graphics,
  director,
  Label,
  tween,
  Vec3,
  UIOpacityComponent,
  Color,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("OverPanel")
export class OverPanel extends Component {
  // [1]
  // dummy = '';

  // [2]
  // @property
  // serializableDummy = 0;
  @property({ type: Label })
  private score: Label | null = null;

  start() {
    // [3]
    this.node.active = false;
  }

  /**
   * 游戏结束，显示弹窗
   */
  public show(score: number) {
    this.score!.string = "" + score;
    this.node.active = true;
  }

  /**
   * 再来一次
   */
  public again() {
   this.node.active = false;
   director.loadScene("game");
  }

  /**
   * 返回菜单
   */
  public backMenu() {
    this.node.active = false;
    director.loadScene("menu");
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
