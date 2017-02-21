import Surface from "../lib/surface";
import Actor from "./Actor";
import Sprite from "./Sprite";

export default class Scene {
  constructor(attributes) {
    this.instances = attributes.instances || [];
    this.viewports = attributes.viewports || [];
    this.height = attributes.height || 480;
    this.width = attributes.width || 640;

    let roomSurface = new Surface({
      insert: true,
      width: this.width,
      height: this.height,
    });

    this.surface = roomSurface.context;

    console.info('[jGame] New scene created:', this);
  }

  create = () => {
    this.instances.map(definition => {
      let instance = definition.type;
      instance.x = definition.x;
      instance.y = definition.y;
      instance.create();
      return instance;
    });
  }

  step = () => {
    this.instances.map(definition => {
      let instance = definition.type;
      instance.innerStep();
      return instance;
    });
  }

  draw = () => {
    let { surface } = this;
    surface.clearRect(0, 0, this.width, this.height);
    this.instances.map(definition => {
      let instance = definition.type;
      surface.save();
      surface.translate(instance.x, instance.y);
      surface.rotate(instance.image_angle * Math.PI / 180);
      surface.scale(instance.xscale, instance.yscale);
      surface.fillStyle = instance.color;
      surface.strokeStyle = instance.color;
      surface.fillRect(0, 0, 32, 32);

      let { sprite_index, image_index } = instance;
      if (sprite_index && sprite_index instanceof Sprite && sprite_index.isReady) {
        // do some math to calculate current x and y position based on image index from instance
        let image_xindex = 0; // horizontal tile position
        let image_yindex = 0; // vertical tile position
        let counter = 0; // helper variable

        // if image index exceed the number of frames, resets it
        if (instance.image_index >= sprite_index.image_number) instance.image_index = 0;
        if (instance.image_index < 0) instance.image_index = sprite_index.image_number - 1;

        // a dangerous while to do it fast
        while(counter < instance.image_index) {
          image_xindex ++;
          if (image_xindex >= sprite_index.h_frames) {
            image_xindex = 0;
            image_yindex ++;
          }
          counter ++;
        }

        // draw the sprite animated
        surface.drawImage(
          sprite_index.img,

          // crop image according to frame height, frame width and image index
          image_xindex * sprite_index.frame_width, // x in source
          image_yindex * sprite_index.frame_height, // y in source
          sprite_index.frame_width, // width in source
          sprite_index.frame_height, // height in source

          // box in the scene
          0, 0, sprite_index.frame_width, sprite_index.frame_height // box on the room
        );

        // Increase image index
        instance.image_index += Math.round(instance.image_speed);
      }

      // Runs the instance draw and restore the surface
      instance.innerDraw();
      surface.restore();
      return instance;
    });
  }
}
