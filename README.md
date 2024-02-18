## Dots and Boxes

Project goal is to create markdown like simple language and visualizer for graph and number algorithms 
and other simple animations visualizing your raw ideas. Dots and boxes is a *HTML5 custom element* you can add to your page with code 
attribute defining dots and boxes and action (animation) steps.

Project was highly inspired by [mermaid.js](https://mermaid.js.org/) project, although it has very different goals

#### Example use cases

- visualize sorting algorithms like bubble sort
- visualize event driven architecture communication 
- visualize common patterns like: request response pattern 

## How to use it
Dots and boxes is using [HTML web components standard](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components)
You need to do two things to start using it

1) Add script reference
    ```html
    <script src="insert_url_here"></script>
    ```
2) Add *dots-and-boxes* tag to your html page e.g.
```html

<dots-and-boxes controls color="white" code="
   title: sort with bubble sort
   box id: win at: -255, -25 size: (100, 50) color: rgba(254,193,7,0.6) visible: false
   dots ids: 1 2 3 5 4 at: -120, 0 size: 20
   step: '(0)' duration: 750
   2 -> +(50,250)
   2 -> +(150,-250)
   step: '(1) select first two numbers'  duration: 2750
   win <- visible: true,  win -> +(110,0)
   2 <-> 1, 1 -> +(0,100)
   step: '(2) swap if left bigger'
   2 <-> 1 // swap dot 2 with 1
   2 -> +(50,0)
   step: '(3) select next two numbers'
   win -> +(50,0) // move window by 50px right
   step: '(4) ignore if left is smaller'
   win -> +(50,0)
   step: '(4) again swap if left bigger'
   5 <-> 3
   step: '(5) bla bla'
   win -> +(50,0)
   step: 'repeat from start'
   win -> -(150,0)
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
and actions like move or swap grouped in steps to make simple animations

In a typical **DABL* program first you define controls like dots and boxes 
and then number of steps affecting their state e.g. changing their position or color

### Define a control
To draw a dot or box beyond specifying control type you might have to set it attribute values.

#### common attributes
Controls support number of attributes which are mostly self describing like:
- **id** - unique id of control - mandatory
- **at** - control start location - optional - default: (0,0)
- **text** - control text - optional - default: empty string
- **size** - control size - optional - default:depend on control type
- **visible** - is control visible - optional - default: true
- **selected** - is control selected - optional - default: false
- **color** - background color of control - optional - default: value from internal color table selected by: len(controls) modulo len(color_table)

### define a dot

Dot is the simplest thing you can show with Dots and Boxes language. 
It draws the control a dot
e.g.

```dabl
dot color: blue text: 'd1' size: 20
```

### define a box

```dabl
box color: red text: 'a text in a box' size: (20,200) visible: true
```

### define a line

```dabl
line color: orange at: (20,200) end: (200, 200) width: 0.5
```
#### special attributes:
- end - second point defining line - mandatory
- width - width of line

### define dots

Define a number of dots

> dots ids: 1 2 3 5 4 at: -120, 0 size: 20

#### special attributes:
- ids - space separated ids of dots, mandatory
- layout - *col* or *row*, optional - default: col

### define boxes

Define a number of boxes

> boxes ids: one two three at: -120, 0 size: (100, 50)

#### special attributes: 
- ids - space separated ids of boxes, mandatory
- layout - *col* or *row*, optional - default: col

### steps and actions

Whenever you want to change any control property you need to take an action. Actions are grouped in steps.

So the simple step could look like this:

```text
step: 'this is my step title' duration: 2s
myBox -> (100,50)
```
Above step has title and takes 2s to run. It consists of one action moving control **myBox** to position 100 50

Below we define possible actions.

### Action types

#### move control to point 

> x -> (x,y)

Move action, moves control to point at position x, y

e.g. moving control a1 to point at position (x,y) 56, 160 would be:

> a1 -> (56,150)

"+" and "-" makes move relative e.g.

> a1 -> +(50,-10)

last option is moving to other control's location

> a1 -> b1

 
#### swap controls

> c1 <-> c2

swaps c1 and c2 position 

#### clone control
e.g.
> c1 *-> new_c1

clones control c1 and creates a new one with id new_c1

#### assign value

> c1 <- text: 'new text' visible: true

Assigns one or more property to control

text property is used by default, so you can omit 'text' property name 
> c2 <- 'my new text'


### special controls

There are two special controls automatically declared by dots and boxes itself

#### **selected** control

selected is a virtual control pointing to currently selected control by user or code.
selected0 is first selected control selected1 second and so on.
e.g. to swap two selected controls you can add action like:
> selected0 <-> selected1


#### **camera** control
camera is a virtual control used just to move viewport.
e.g.
> camera -> +(100,50)

### <dots-and-boxes> tag 
As mentioned above <dots-and-boxes> works just like normal html tag (e.g. you can style it).
It supports number of attributes and events 

#### <dots-and-boxes> attributes

**code** - this is where actual **DABL** code is assigned

**controls**  - show controls menu

**autoplay** - starts fast-forward on load

**keyboard** - left and right arrow does backward and forward respectively

**debug**  - show some debug information 

**experimental**  - show some experimental tools. Be aware that those can change or disappear without any notice. 

#### <dots-and-boxes> events

**initialized** - happens after control is initialized

**on_before_step_forward** - happens whenever step is going to be running forward

**on_before_step_backward** - happens whenever step is going to be running backward

## credits

- [Easing functions](https://gizma.com/easing/)
- [Prism.js - code highlighting](https://prismjs.com/)
- [mermaid.js](https://mermaid.js.org/) 