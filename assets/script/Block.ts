import { _decorator, Component, Node, tween, Vec3, Tween } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Block")
export class Block extends Component {
  // [1]
  // dummy = '';

  // [2]
  // @property
  // serializableDummy = 0;

  private fallHeight: number = 500;
  private fallDuration: number = 0.3;

  start() {
    // [3]
  }

  public init(
    fallDuration: number,
    fallHeight: number,
    destroyTime: number,
    destroyCallback: Function
  ) {
    this.fallDuration = fallDuration;
    this.fallHeight = fallHeight;
    this.scheduleOnce(() => {
      destroyCallback(this);
    }, destroyTime);
  }

  /**
   * 下沉游戏动画
   */
  public getSinkingTween(): Tween<Node> {
    return tween(this.node).by(this.fallDuration, {
      position: new Vec3(0, -this.fallHeight, 0),
    });
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
