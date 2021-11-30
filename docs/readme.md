# ParkRunner Game #

### Background

The infinite runner game is one where the player continuously runs across the screen dodging obstacles for as long as they can.  They lose the game if they come into contact with the obstacle.

### Functionality & MVP

Users will be able to:

- [x] Start and restart the game
- [x] Use the keyboard arrow keys to control the game

In addition, this project will include:

- [x] An About screen describing the rules of the game
- [x] A production README   

This project will be implemented with the following technologies:

Vanilla JavaScript for overall structure and game logic, Create.js suite including Easel.js, Tween.js, and Sound.js  for animations and rendering, Webpack to bundle and serve up the various scripts.

### Implementation Timeline

**Day 1**:
- Create `webpack.config.js`.
- Dedicate this day to learning the `Create.js` API and learn the basics of `Easel.js`.
- Include static background image and draw road where game play will occur.

**Day 2**:   
- Create running sprite animation character and basic object animations across the screen.  
  * Draw and/or find coin, bomb and log sprites.
- Create user controls to move across the road and jump.  

**Day 3**:
- Add title page, instruction page, and game over modals with key functions to navigate the pages.  
- Create collision listeners between the player and the items.
  * remove items from the canvas once they have moved off screen.
- Display coin count on the corner of the screen that updates whenever player collects a coin.


**Day 4**:
- Finish cleaning up animations and include a speed up of items the longer a player is in the game.  
- Add background scrolling objects including trees and grass sprites for a more dynamic view.
