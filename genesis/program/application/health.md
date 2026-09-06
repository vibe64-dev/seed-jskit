# Service health

Let operators determine whether the application server is available.

## Sources

- `server.js`

## Public contract

A health request accepts no input and returns a successful JSON response identifying
the application when the server can handle requests. It has no product-side effects.
