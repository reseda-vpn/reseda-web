### `reseda-web`

Reseda VPN Website and Javascipt API endpoint. Here, the HTTP routes for [reseda](https://reseda.app) are served.

This is handled as a next-js server which integrates the database to display all stored user data. Note, any and all data stored about any user can be observed through UI, there is no information intentionally hidden from any user.

This integrates with the reseda client which shares UI themes and culminated ideologies, although at different stages of development.

A few legacy routes here are to be closed in the near future to prevent unauthorised routes from accessing core data or services.

Hosted on a single digital ocean droplet this component is the most volatile and least important not to mention slow portion of the reseda system. Its improved uptime its only as a direct measure to improve the user experience, this may well be rebuilt or refactored with WASM in the near future as to improve its performance and reliability so look out for that!
