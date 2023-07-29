## Animations expressed as Mermaid like easy to read/understand language

Here I am gathering use cases and proposed syntax

Idea 1 - Visualise sorting algorithm

```text

title: bubble sort
dots (at: 120, 160): 1, 2, 7, 4
component (size: 230, 450): trash
locations: A(373,738), 
animate: 4 <-> 7,  2 -> trash, 7 -> A

```

Idea 2 - Visualise components communicating over message bus in event driven architecture


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


