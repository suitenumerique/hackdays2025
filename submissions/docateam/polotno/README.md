# 🎈 polotno-partykit

Playground for enabling real-time collaboration in Polotno using PartyKit.

Welcome to the party, pal!

This is a [Partykit](https://partykit.io) project, which lets you create real-time collaborative applications with minimal coding effort.

This is the **React starter** which pairs a PartyKit server with a React client.

Refer to our docs for more information: https://github.com/partykit/partykit/blob/main/README.md. For more help, reach out to us on [Discord](https://discord.gg/g5uqHQJc3z), [GitHub](https://github.com/partykit/partykit), or [Twitter](https://twitter.com/partykit_io).

## Usage

You can start developing by running `npm run dev` and opening [http://localhost:1999](http://localhost:1999) in your browser. When you're ready, you can deploy your application on to the PartyKit cloud with `npm run deploy`.

## Finding your way around

[`party/server.ts`](./party/server.ts) is the server-side code, which is responsible for handling WebSocket events and HTTP requests.

It implements a simple counter that can be incremented by any connected client. The latest state is broadcast to all connected clients.

> [!NOTE]
> The full Server API is available at [Party.Server in the PartyKit docs](https://docs.partykit.io/reference/partyserver-api/)

[`app/client.tsx`](./src/client.ts) is the entrypoint to client-side code.

[`app/components/Counter.tsx`](./src/components/Counter.tsx) connects to the server, sends `increment` events on the WebSocket, and listens for updates.

> [!NOTE]
> The client-side reference can be found at [PartySocket in the PartyKit docs](https://docs.partykit.io/reference/partysocket-api/)

As a client-side React app, the app could be hosted every. During development, for convenience, the server serves the client-side code as well.

This is achieved with the optional `serve` property in the [`partykit.json`](./partykit.json) config file.

> [!NOTE]
> Learn about PartyKit config under [Configuration in the PartyKit docs](https://docs.partykit.io/reference/partykit-configuration/)

## Next Steps

Learn about deploying PartyKit applications in the [Deployment guide of the PartyKit docs](https://docs.partykit.io/guides/deploying-your-partykit-server/).
