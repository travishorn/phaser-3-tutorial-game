import { Game, AUTO } from "phaser";
import { preload, create, update } from "./scene";

new Game({
  type: AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
});
