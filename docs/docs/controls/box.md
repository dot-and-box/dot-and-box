---
sidebar_position: 2
---


# Box

```dabl tab showLineNumbers
title: 'red box'
box id: b at: [-1,-1] size: [2,2] color: red text: 'box' 
```
```html tab showLineNumbers
<dots-and-boxes style="height: 250px" code="
    title: 'red box'
    box id: b at: [-1,-1] size: [2,2] color: red text: 'box'">
</dots-and-boxes>
```

<dots-and-boxes style={{height: 250}}  code="
    title: 'red box'
    box id: b at: [-1,-1] size: [2,2] color: red text: 'box'">
</dots-and-boxes>

#### dot attributes
Controls support number of attributes which are mostly self describing like:
- **id** - unique id of control - mandatory
- **at** - control start location - optional - default: (0,0)
- **text** - control text - optional - default: empty string
- **size** - control size - optional - default: cell size
- **visible** - is control visible - optional - default: true
- **selected** - is control selected - optional - default: false
- **color** - background color of control - optional - default: value from internal color table selected by: len(controls) modulo len(color_table)
