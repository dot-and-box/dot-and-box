## dot and box

**dot and box** allows drawing dots and boxes and do simple step based animations making it easy to
visualise some algorithms or your raw ideas e.g. show event flow in a distributed system.

## Documentation and examples

See [documentation](https://dot-and-box.github.io/dot_and_box) and see [examples](https://dot-and-box.github.io/dot_and_box/category/examples)

![dab_view.png](docs%2Fstatic%2Fimg%2Fdab_view.png)



## project goal

Project goal is to create a simple language and visualizer to explain algorithms and common CS patterns
or do simple step based animations visualizing your raw ideas. Technically dot and box is an *HTML5 custom element* you can add to your page with code 
attribute defining dot and box and action (animation) steps.

#### Example use cases

- visualize algorithm ideas e.g. bubble sort
- visualize common CS patterns e.g. request response pattern 
- visualize event driven architecture communication

## How to use it
dot and box is using [HTML web components standard](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components)
You need to do two things to start using it

1) install script by npm 
   ```shell
   npm i dot-and-box
   ```

2) Add script reference
    ```html
    <script src="dot-and-box.js"></script>
    ```
3) Add *dot-and-box* tag to your html page e.g.
```html

<dot-and-box controls color="white" code="
   title: sort with bubble sort
   box id: win at: [-6, 0] size: [2, 1] color: rgba(254,193,7,0.6) visible: false
   dots ids: 2 1 5 3 4 at: [-3,0] size: 20
   step: '(1) select first two numbers' duration: 0.8s
   win <- visible: true, win -> +[3,0]
   step: '(2) swap if left bigger than right'
   2 <-> 1 // swap dot 2 with 1
   step: '(3) select next two numbers'
   win -> +[1,0] // move window by 1 cell right
   step: 'ignore if left is smaller and select next'
   win -> +[1,0]
   step: 'again swap if left bigger'
   5 <-> 3
   step: 'and again'
   win -> +[1,0]
   5 <-> 4
   step: 'repeat from start'
   win -> -[3,0]"
</dot-and-box>
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
### build docs
```shell
nvm use 20
cd docs
npm run start
```

## credits
- [Crafting interpreters](https://craftinginterpreters.com/)
- [Easing functions](https://gizma.com/easing/)
- [Prism.js - code highlighting](https://prismjs.com/)
- [mermaid.js](https://mermaid.js.org/)
- [Drawing arc in SVG](http://xahlee.info/js/svg_circle_arc.html)