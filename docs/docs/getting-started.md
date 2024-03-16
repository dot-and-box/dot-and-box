---
sidebar_position: 2
---

# Getting started

All you need to do is add **dots and boxes** js script reference and add dots-and-boxes tag in your html page. 

1) Add script reference
    ```html
    <script src="dots-and-boxes.js"></script>
    ```
2) Add *dots-and-boxes* tag to your html page e.g.
    ```html
    <dots-and-boxes controls code="
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
      win -> -[3,0]">
    </dots-and-boxes>
    ```
