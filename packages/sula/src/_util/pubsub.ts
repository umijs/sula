class PubSubManager {
  subscribes : Record<string, Function[]> = {};

  pub = (name: string, payload?: any) => {
    const handlers = this.subscribes[name];
    if(!handlers) {
      return;
    }
    for(let i = 0, len = handlers.length; i < len; i+= 1) {
      const handler = handlers[i];
      handler && handler(payload);
    }
  }

  sub = (name: string, handler: Function) => {
    if(!this.subscribes[name]) {
      this.subscribes[name] = [];
    }

    this.subscribes[name].push(handler);

    return () => this.unsub(name, handler);
  }

  unsub = (name: string, handler: Function) => {
    if(!this.subscribes[name]) {
      return;
    }

    const handlerIndex = this.subscribes[name].indexOf(handler);
    this.subscribes[name].splice(handlerIndex, 1);
  }
}

const PubSub = new PubSubManager();

export default PubSub;

