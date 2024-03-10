---
sidebar_position: 2
---


Box control

```dabl    
    title: 'dot color and size'
    box id: A at: [-3,0] color: red  selected: true 
```

<dots-and-boxes style={{height: 250}}  code="
title: 'red box'
box id: b at: [-1,-1] size: [2,2] color: red text: 'box' ">
</dots-and-boxes>

#### dot attributes
Controls support number of attributes which are mostly self describing like:
- **id** - unique id of control - mandatory
- **at** - control start location - optional - default: (0,0)
- **text** - control text - optional - default: empty string
- **size** - control size - optional - default:depend on control type
- **visible** - is control visible - optional - default: true
- **selected** - is control selected - optional - default: false
- **color** - background color of control - optional - default: value from internal color table selected by: len(controls) modulo len(color_table)
