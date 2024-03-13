---
sidebar_position: 5
---

#  Dots and boxes tag

### \<dots-and-boxes\> tag elem
**\<dots-and-boxes\>** is just a normal html tag (e.g. you can style it).

It supports number of attributes and events.

### attributes

**code** - this is where actual **DABL** code is assigned

**controls**  - show controls menu

**autoplay** - starts fast-forward on load

**keyboard** - left and right arrow does backward and forward respectively

**debug**  - show some debug information

**experimental**  - show some experimental tools. Be aware that those can change or disappear without any notice.

### events

**initialized** - happens after \<dots-and-boxes\> html control is initialized

**on_before_step_forward** - happens whenever step is going to be running forward

**on_before_step_backward** - happens whenever step is going to be running backward
