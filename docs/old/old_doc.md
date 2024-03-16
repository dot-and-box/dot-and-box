
## DABL - (D)ot (A)nd (B)ox (L)anguage

**DABL** allows to declare controls like dot and box
and actions like move or swap grouped in steps to make simple animations

In a typical **DABL* program first you define controls like dot and box
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

Dot is the simplest thing you can show with dot and box language.
It draws the control a dot
e.g.

```dabl
dot color: blue text: 'd1' size: 20
```

### define a box

```dabl
box color: red text: 'a text in a box' size: (20,200) visible: true
```
#### special attributes:
- fontSize -  text font size - optional - defaults to DEFAULT_FONT_SIZE

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
- span - number of empty cells between dots
- colors - space separated color list used to fill dots

### define boxes

Define a number of boxes

> boxes ids: one two three at: -120, 0 size: (100, 50)

#### special attributes:
- ids - space separated ids of boxes, mandatory
- layout - *col* or *row*, optional - default: col
- span - number of empty cells between boxes
- colors - space separated color list used to fill boxes

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
