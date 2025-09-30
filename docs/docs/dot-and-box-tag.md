---
sidebar_position: 5
---

# Dot and Box tag

### \<dot-and-box\> tag elem

**\<dot-and-box\>** is a custom html tag and behaves like standard html tag (e.g. you can style it).

It supports attributes and events.

### attributes

**code** - this is where actual **DABL** code is assigned

**controls** - show controls menu

**autoplay** - starts fast-forward on load

**keyboard** - left and right arrow does backward and forward respectively

**debug** - show some debug information

**experimental** - show some experimental tools. Be aware that those can change or disappear without any notice.

### events

**initialized** - happens after \<dots-and-boxes\> html control is initialized

**on_before_step_forward** - happens whenever step is going to be running forward

**on_before_step_backward** - happens whenever step is going to be running backward
