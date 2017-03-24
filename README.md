Guess-a-Sketch
===

Half party game, half AI experiment.

Each round, you get a prompt (eg "cat"). Draw it! 
Well, as best you can, until the timer runs out. 
Get points based on the quality of your drawing.

Points are awarded by a program which can recognize objects
in napkin-quality sketches. The program learns how to do this
using machine learning - specifically, neural networks.

---

The App
---
The party game is implemented as a Meteor web app, using React for the UI. Details can be found here: [app/README.md](app/README.md)

The Net
---
The Ai is implemented as a neural network, using Tensorflow. Details can be found here: [SketchNet/README.md](SketchNet/README.md)

