import {
  _decorator,
  Component,
  Node,
  v2,
  tween,
  Vec3,
  Tween,
  AudioClip,
  AudioSource,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Component {
  // [1]
  // dummy = '';

  // [2]
  // @property
  // serializableDummy = 0;
  private stepDistance: number = 0;
  private jumpHeight: number = 0;
  private jumpDuration: number = 0;
  public canJump: boolean = false;
  public index: number = 0;
  private curPosition: Vec3 | null = null;
  private fallDuration: number = 0;
  private fallHeight: number = 0;
  @property({ type: AudioClip })
  private oneStepAudio: AudioClip | null = null;
  @property({ type: AudioClip })
  private twoStepAudio: AudioClip | null = null;
  @property({ type: AudioClip })
  private dieAudio: AudioClip | null = null;
  @property({ type: AudioSource })
  private audio: AudioSource | null = null;

  start() {
    // [3]
  }

  /**
   * 参数初始化
   */
  public init(
    stepDistance: number,
    jumpHeight: number,
    jumpDuration: number,
    fallDuration: number,
    fallHeight: number
  ) {
    this.stepDistance = stepDistance;
    this.jumpHeight = jumpHeight;
    this.jumpDuration = jumpDuration;
    this.canJump = true;
    this.fallDuration = fallDuration;
    this.fallHeight = fallHeight;
    this.curPosition = this.node.getPosition();
  }

  /**
   * 跳跃动作
   */
  public jump(step: number, callback: Function) {
    this.canJump = false;
    this.index += step;
    //跳跃距离和高度
    let distance = step * this.stepDistance;
    let y = step * this.jumpHeight;
    //跳起高度和位置
    let jumpUp = this.getJumpUpTween(distance, y);
    //跳下高度和位置
    let jumpDown = this.getJumpDownTween(distance);
    tween(this.node)
      .sequence(jumpUp, jumpDown)
      .call(() => {
        this.canJump = true;
        callback();
      })
      .start();
    this.playJumpAudio(step);
  }

  /**
   * 跳跃声音
   */
  private playJumpAudio(step: number) {
    if (step == 1) {
      this.audio?.playOneShot(this.oneStepAudio!, 1);
    } else if (step == 2) {
      this.audio?.playOneShot(this.twoStepAudio!, 1);
    }
  }

  /**
   * 结束声音
   */
  public playDieAudio() {
 this.audio?.playOneShot(this.dieAudio!, 1);
  }

  /**
   * 跳起动作
   * @property distance 跳跃距离
   * @property y 目标坐标y轴
   */
  private getJumpUpTween(distance: number, y: number): Tween<Node> {
    //对之前的位置数据进行累加
    let jumpV3 = new Vec3(distance / 2, y, 0);
    jumpV3.add(this.curPosition!);
    return tween(this.node).to(
      this.jumpDuration,
      { position: jumpV3 },
      { easing: "sineIn" }
    );
  }

  /**
   * 跳起动作
   * @property distance 跳跃距离
   */
  private getJumpDownTween(distance: number): Tween<Node> {
    this.curPosition?.add3f(distance, 0, 0);
    return tween(this.node).to(
      this.jumpDuration,
      { position: this.curPosition! },
      { easing: "sineOut" }
    );
  }

  /**
   * 延时执行游戏结束
   */
  public startDelayOverGameAnimation() {
    this.scheduleOnce(() => {
      this.getSinkingTween().start();
    }, this.jumpDuration * 2);
  }

  /**
   * 下沉游戏动画
   */
  public getSinkingTween(): Tween<Node> {
    return tween(this.node).by(
      this.fallDuration,
      {
        position: new Vec3(0, -this.fallHeight, 0),
      },
      { easing: "smooth" }
    );
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
