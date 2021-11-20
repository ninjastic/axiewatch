import jsonfile from 'jsonfile';
import path from 'path';

class Proxies {
  proxies: string[];

  constructor() {
    this.load();
  }

  private async load() {
    const file = path.resolve(__dirname, '..', '..', 'proxies.json');
    this.proxies = jsonfile.readFileSync(file);

    if (this.proxies.length <= 0) {
      throw new Error('proxies.json file is empty');
    }
  }
}

export default new Proxies().proxies;
