## Animations expressed as Mermaid like easy to read/understand language

Here I am gathering use cases and proposed syntax

Idea 1 - Visualise sorting algorithm

```text
title: bubble sort
dots: 
    at: 120, 160 // at is optional defaults to center
    size: 45
    data: 1, 2, 7, 4   
boxes: 
    at: 120, 160  
animate: 
    1: 4 <-> 7
    2: 1 <-> 2
```


```text
title: two controls group dance
group: few controls
    at: 123, 322
    layout: horizontal
    color: red
    dot: 1 
    box: trash 
    dot: 3
    dot: 4
    dot: A    
    dot: 7    
dots: group name id
    at: 323, 322
    data: 45, 23, 23, 78
animate: 
    1: 1s, 4 <-> 7,  2 -> trash, 7 -> A
    2: 400ms, 4 <-> 7,  4 -> trash, 7 -> A
```

Idea 2 - Visualise components communicating over message bus in event driven architecture

TODO: syntax is really wrong

```text
title: EDA example
domain: customer
components: customer, orders, profile, payments
domain: bookings 

events: 
credit-updated -> profile
cust-registered -> customer
logged-in -> customer, profile
new-order -> profile, payments

step: 1
publish: customer: logged-in (id: 78),
orders: new-order (id: 768, title: socks, price: 100)
step: 2
```

Idea 3
```text
title: bubble sort
box:
name: router
 at: 120, 160
 size: 100, 150
dots:
 at: 50, 160
 size: 35.6
 data: '3','6','8','9','4','7','1','2'
actions:
 '4' <-> '7'
 '1' <-> '2'
 '3' *-> '12
```text