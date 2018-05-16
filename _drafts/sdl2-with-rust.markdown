---
layout: "post"
title: "sdl2 with rust"
date: "2017-07-05 17:02"
image: "assets/images/rust.png"
---

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo

<!--more-->

Create your project using cargo.

```
cargo new {project-name}
```

First let's create a window.

```
extern crate sdl2;
pub fn main() {
    let sdl_context = sdl2::init().unwrap();
    let video_subsystem = sdl_context.video().unwrap();

    let window = video_subsystem.window("primo tutorial", 800, 600)
      .position_centered()
      .opengl()
      .build()
      .unwrap();
}
```

We still do not see anything when we do:
```
cargo run
```

We need a loop to maintain the program alive! Modify the code as following.

```
extern crate sdl2;
use sdl2::event::Event;
use sdl2::keyboard::Keycode;

pub fn main() {
    let sdl_context = sdl2::init().unwrap();
    let video_subsystem = sdl_context.video().unwrap();

    let window = video_subsystem.window("primo tutorial", 800, 600)
      .position_centered()
      .opengl()
      .build()
      .unwrap();

    let mut event_pump = sdl_context.event_pump().unwrap();

    'running: loop {
        for event in event_pump.poll_iter() {
            match event {
                Event::Quit {..} | Event::KeyDown { keycode: Some(Keycode::Escape), .. } => {
                    break 'running
                },
                _ => {}
            }
        }
    }
}

```

Now we see just an empty window, probably you are seeing just a screenshot of your terminal.
We need to get the canvas from our window and tell it to paint it's background with some color we like. 
