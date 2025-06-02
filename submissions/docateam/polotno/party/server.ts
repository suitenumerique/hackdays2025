import type * as Party from 'partykit/server';

export default class Server implements Party.Server {
  count = 0;
  // users = new Set<Party.Connection>();

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    // send the current count to the new client
    conn.send(this.count.toString());
  }

  onMessage(message: string, sender: Party.Connection) {
    const event = JSON.parse(message);
    if (event.type === 'patch') {
      this.room.broadcast(message, [sender.id]);
    }
    if (event.type === 'request-state') {
      [...this.room.getConnections()][0].send(
        JSON.stringify({ type: 'request-state' })
      );
    }
    if (event.type === 'reset-state') {
      this.room.broadcast(
        JSON.stringify({ type: 'reset-state', state: event.state })
      );
    }
  }

  onRequest(req: Party.Request) {
    // response to any HTTP request (any method, any path) with the current
    // count. This allows us to use SSR to give components an initial value

    // if the request is a POST, increment the count
    if (req.method === 'POST') {
      this.increment();
    }

    return new Response(this.count.toString());
  }

  increment() {
    this.count = (this.count + 1) % 100;
    // broadcast the new count to all clients
    this.room.broadcast(this.count.toString(), []);
  }
}

Server satisfies Party.Worker;
