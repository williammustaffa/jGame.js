import { Actor, Scene, Sprite, Game } from "./core/entities";
import { CONSTANTS } from "./core/utils";

let sprPlayer = new Sprite({
  src: './assets/sprites/sprite2.png', // sprite source
  h_frames: 7, // number of horizontal frames to be splited
  v_frames: 2, // number of vertical frames to be splited
  offset_left: 5,
  offset_right: 3,
  offset_top: 5,
  offset_bottom: 0,
  x_origin: CONSTANTS.center, // center sprite on actor x coordinate
  y_origin: CONSTANTS.center, // center sprite on actor y coordinate
});

class actorPlayer extends Actor {
  constructor() {
    super();
    this.solid = true;
    this.image_speed = 0;
    this.image_index = 13;
    this.sprite_index = sprPlayer;
    this.gravity = 0.5;
    this.gravity_direction = 270;
  }
  step() {
    let canJump = false;
    if (keyboard.check(CONSTANTS.left)) {
      this.x--;
    }
    if (keyboard.check(CONSTANTS.right)) {
      this.x++;
    }
    if (this.y + (this.sprite_index.frame_height / 2) > this.room.height) {
      this.vspeed = 0;
      canJump = true;
    }
    if (keyboard.pressed(CONSTANTS.space) && canJump) {
      this.vspeed = -10;
    }
  }
  draw() {
    
  }
}

class sceneDemo extends Scene {
  constructor() {
    super();
    this.width = 640; // scene width
    this.height = 480; // scene height
    this.viewports = [
      {
        x: 0, // point x on scene
        y: 0, // point y on scene
        width: 640, // viewport width in scene
        height: 480, // viewport height in scene
        window_x: 0, // point x in game window
        window_y: 0, // point y in game window
        window_w: 640, // width in game window
        window_h: 480, // height in game window
      },
    ];
    this.instances = [
      {
        type: actorPlayer, // instance type
        x: 240, // instance start position x
        y: 240, // instance start position y
      },
    ];
  }
};

let gameEntity = new Game({
  width: 640, // window(canvas) width
  height: 480, // window height
  assets: [
    sprPlayer, // add asset to the loader
  ],
  scenes: [
    sceneDemo, // add scene on the game
  ],
}).init();