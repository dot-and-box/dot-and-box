---
sidebar_position: 2
---


# Box

Box control

```dabl tab showLineNumbers
title: 'red box'
box id: b at: [-1,-1] size: [2,2] text: 'box' 
```
```html tab showLineNumbers
<dot-and-box style="height: 250px" code="
    title: 'red box'
    box id: b at: [-1,-1] size: [2,2] text: 'box'">
 </dot-and-box>
```

<dot-and-box style={{height: 250}}  code="
    title: 'red box'
    box id: b at: [-1,-1] size: [2,2]  text: 'box'">
 </dot-and-box>

#### box attributes
Box support number of attributes which are mostly self describing like:
- **id** - unique id of box - mandatory
- **at** - box start location - optional - default: (0,0)
- **text** - box text - optional - default: empty string
- **size** - box size - optional - default: cell size
- **visible** - is box visible - optional - default: true
- **selected** - is box selected - optional - default: false
- **color** - background color of box - optional - default: value from internal color table selected by: len(controls) modulo len(color_table)
