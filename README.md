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
    title: Visualizing algorithm
    box text: 'sort' id: b1 color: rgba(137,33,133,0.78) at: -180, -120 size: 260, 80
    dot text: '1' color: black at: -100, 0 size: 35">
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

*DABL* language allows to declare controls like dots and boxes
and action steps like move or swap action.

### define a dot

Dot is the simplest thing you can show with DABL. 
It draws the control a dot
e.g.

```dabl
dot 
 color: fred
 text: 'd1'
 size: 20
```
### define a box

```dabl
box 
 color: fred
 text: 'a text in a box'
 size: 20,200
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

#### swap controls

> c1 <-> c2

swaps c1 and c2 position 

#### clone control

> c1 *-> new_c1

Clone control c1 and creates a new one named new_c1


## credits

- [Easing functions](https://gizma.com/easing/)