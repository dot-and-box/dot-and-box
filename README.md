## dot and box

**dot and box** allows drawing dots and boxes and do simple step based animations making it easy to
visualise some algorithms or your raw ideas e.g. show event flow in a distributed system.

[![dab_view.png](https://dot-and-box.github.io/dot-and-box/img/dab_view.png)](https://dot-and-box.github.io/dot-and-box)
## Documentation and examples

See [documentation](https://dot-and-box.github.io/dot-and-box) and [examples](https://dot-and-box.github.io/dot-and-box/category/examples)
or play with [live editor here](https://dot-and-box.github.io/dot-and-box-editor/)

#### Example use cases

- visualize algorithm ideas e.g. bubble sort
- visualize common CS patterns e.g. request response pattern 
- visualize event driven architecture communication

## How to use it
dot and box is using [HTML web components standard](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components)

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
   dots ids: 2 1 5 3 4 at: [-3,0] radius: 20
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
