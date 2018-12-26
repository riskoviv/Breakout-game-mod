This game is a modified version of educational example of Breakout game from MDN's website located at
https://developer.mozilla.org/ru/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript

Features that I've been additionally implemented in this game:
1) Game (ball movement) starts only after first paddle movement
2) Thin stroke around the ball (for better ball visibility in the case of light ball filling color)
3) Adjustment of canvas and all game elements to the size of the window when window size changes and at the game loading
4) Minimal size of canvas at the loading, minimal paddle Y position
5) Ball changes its color to the color of last destroyed brick
6) Ball bouncing from every side of bricks, not only from bottom
7) Every brick in every different game has different random color
8) Pausing by pressing Esc, displaying "PAUSE" text at the center of canvas (with counting lengh of text)
9) Modified ball and floor collision detection (losing) with displaying a message and changing a paddle color
10) Different angle of ricocheting of a ball from the paddle
11) Speed of paddle and ball differs ralatively of canvas size
12) Different start ball movement direction at every start
13) Controlling of paddle by 'A' and 'D' buttons additionally to arrows
14) Displaying of win message and turning of an autopilot mode on after winning
15) Displaying of control hints at the start (only at the first start)