## Dots and Boxes

Project goal is to create markdown like simple language and visualizer for graph and number algorithms 
and other simple animations visualizing your raw ideas. Dots and boxes is a *HTML5 custom element* you can add to your page with code 
attribute defining dots and boxes and action (animation) steps.


#### Use cases
- visualize bubble sort algorithm
- event driven architecture communication visualization
- visualize common request response pattern 

## How to use

Just insert source script reference and declare dots and boxes custom tag

eg.

```html
<script src="insert_url_here"></script>
<dots-and-boxes style="margin:20px;height: 400px; width: 600px" color="white" code="
    title: sort with bubble sort
    box id: txt at: -150, -90 size: (260, 80) visible: false
    box id: win at: -255, -25 size: (100, 50) color: rgba(254,193,7,0.6) visible: false
    dot id: 1 at: -70, 0 size: 20
    dot id: 2 at: -120, 0 size: 20
    dot id: 3 at: 30, 0 size: 20
    dot id: 5 at: -20, 0 size: 20
    dot id: p  text: '4' at: 80, 0 size: 20
    steps:
    win <- visible: true, win -> +(110,0), txt <- '(1) select first two numbers'  visible: true
    txt <- '(2) swap if left bigger than right', 2 <-> 1 // swap dot 2 with 1
    txt <- '(3) select next two numbers', win -> +(50,0) // move window by 50px right
    txt <- 'ignore if left is smaller', win -> +(50,0)
    txt <- 'again swap if left bigger', 5 <-> 3
    txt <- visible: false, win -> +(50,0)
    5 <-> p
    txt <- 'repeat from start' visible: true, win -> -(150,0)">
</dots-and-boxes>
```

## Development

### Run in dev mode

```shell
npm run dev
```

### Build from source code

```shell
npm run build
```

### Test

```shell
npm run test
```

## DABL - (D)ots (A)nd (B)oxes (L)anguage

**DABL** allows to declare controls like dots and boxes
and action steps like move or swap action to make simple step animations

### define a dot

Dot is the simplest thing you can show with Dots and Boxes language. 
It draws the control a dot
e.g.

```dabl
dot color: fred text: 'd1' size: 20
```
### define a box

```dabl
box color: fred text: 'a text in a box' size: (20,200), visible: true
```
### declare step actions

Action types

#### move control to point 

> x -> (x,y)

Move action, moves control to point at position x, y

e.g. moving control a1 to point at position (x,y) 56, 160 would be:
```text
a1 -> (56,150)
```
"+" and "-" makes move relative e.g.
```text
a1 -> +(50,-10)
```
last option is moving to other control's location
```text
a1 -> b1
```
 
#### swap controls

> c1 <-> c2

swaps c1 and c2 position 

#### clone control
e.g.
> c1 *-> new_c1

clones control c1 and creates a new one with id new_c1

#### assign value

> c1 <- text: 'new text' visible: true

Assign one or more property to control

### <dots-and-boxes> tag attributes

#### Supported attributes

**controls**  - show controls menu

**autoplay** - starts fast-forward on load

**keyboard** - left and right arrow does backward and forward respectively

## credits

- [Easing functions](https://gizma.com/easing/)