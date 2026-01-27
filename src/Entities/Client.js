export class Client {
  constructor(data = {}) {
    this.name = data.name;
    this.active = data.active ?? true;
  }
}
