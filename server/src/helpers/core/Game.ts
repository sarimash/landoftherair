
import { Inject, Singleton } from 'typescript-ioc';

import { Database } from './Database';
import { AccountDB } from './db';
import { Logger } from './Logger';

@Singleton
export class Game {
  @Inject private db!: Database;

  @Inject public logger!: Logger;
  @Inject public accountDB!: AccountDB;

  public async init() {

    this.logger.log('Game', 'Initializing database...');
    await this.db.init();

    this.loop();
  }

  public loop() {
    // setTimeout(() => this.loop(), 100);
  }
}
