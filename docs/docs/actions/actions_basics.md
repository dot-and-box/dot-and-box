---
sidebar_position: 1
---

# Basics

Actions basics

## Action types

There are two types of actions: instant (like assign or clone) and non-instant which are animated.

## Grouping actions into steps

As explained in the **[tutorial](/tutorial/actions-and-steps#steps)** actions can be grouped into steps in either sequenced or parallel way.

## Steps duration

It is possible to assign **duration** attribute to step
e.g. following step consists of two actions done in total time of 2 seconds

```dabl tab showLineNumbers
dot id: d1 at: [-3,0]
step: 'move dot by 4 cells right and two up' duration: 2s
d1 -> +[4,0]
d1 -> +[0,-2]
```

```html tab showLineNumbers
<dot-and-box
  controls
  style="height: 250px"
  code="
dot id: d1 at: [-3,0]
step: 'move dot by 4 cells right and two up' duration: 2s
d1 -> +[4,0] 
d1 -> +[0,-2]"
>
</dot-and-box>
```

<dot-and-box controls style={{height: 250}} code="
dot id: d1 at: [-3,0]
step: 'move dot by 4 cells right and two up' duration: 2s
d1 -> +[4,0]
d1 -> +[0,-2]">
</dot-and-box>

## Duration units

By default, duration is measured in milliseconds, but you can apply unit explicitly so e.g.
following represent same duration

```dabl
duration: 2000  // no unit means milliseconds
duration:  2000ms // milliseconds
duration: 2s  // seconds
```
