import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';

import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { GameServerEvent, IGround, INPC, IPlayer } from '../../../../interfaces';
import { GameState } from '../../../../stores';
import { GameService } from '../../../services/game.service';
import { SocketService } from '../../../services/socket.service';
import { UIService } from '../../../services/ui.service';
import { MapRenderGame } from './phasergame';
import { MapScene, PreloadScene } from './phaserstates';

const Phaser = (window as any).Phaser;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  @Select(GameState.itemTooltip) public itemTooltip$: Observable<string>;

  @Select(GameState.players) private allPlayers$: Observable<Record<string, Partial<IPlayer>>>;
  @Select(GameState.npcs) private allNPCs$: Observable<Record<string, Partial<INPC>>>;
  @Select(GameState.openDoors) private openDoors$: Observable<Record<number, boolean>>;
  @Select(GameState.ground) private ground$: Observable<IGround>;

  // simple subjects to be passed into the map for whatever purposes
  public map = new BehaviorSubject<any>(null);
  public currentPlayer = new BehaviorSubject<IPlayer>(null);
  public allPlayers = new BehaviorSubject<Record<string, Partial<IPlayer>>>({ });
  public allNPCs = new BehaviorSubject<Record<string, Partial<INPC>>>({ });
  public openDoors = new BehaviorSubject<Record<number, boolean>>({ });
  public ground = new BehaviorSubject<IGround>({ });

  // subs
  playerSub: Subscription;
  npcSub: Subscription;
  doorSub: Subscription;
  groundSub: Subscription;

  // loading text
  private loadPercent = new BehaviorSubject<string>('');
  public loadString: string;
  public fadeOut: boolean;

  private game: MapRenderGame;

  constructor(
    private gameService: GameService,
    private socketService: SocketService,
    private zone: NgZone,
    public uiService: UIService
  ) { }

  ngOnInit(): void {

    this.playerSub = this.allPlayers$.subscribe(pHash => this.allPlayers.next(pHash));
    this.npcSub = this.allNPCs$.subscribe(pHash => this.allNPCs.next(pHash));
    this.doorSub = this.openDoors$.subscribe(dHash => this.openDoors.next(dHash));
    this.groundSub = this.ground$.subscribe(g => this.ground.next(g));

    // play game when we get the signal and have a valid map
    combineLatest([
      this.gameService.playGame$,
      this.gameService.currentPlayer$,
      this.gameService.currentMap$
    ]).subscribe(([play, player, map]) => {
      if (!play || !player || !map) return;
      this.map.next(map);
      this.currentPlayer.next(player);

      if (!this.game) {
        this.zone.runOutsideAngular(() => {
          this.initMap();
        });
      }
    });

    // have to do it this way so zone doesn't lose it's mind
    this.loadPercent.subscribe(d => {
      this.zone.run(() => {

        // if we don't have anything, we set a fadeout boolean and then trigger css animations
        if (!d) {
          this.fadeOut = true;

          setTimeout(() => {
            this.loadString = d;
            this.fadeOut = false;
          }, 5000);

          return;
        }

        // if we do have something, we just set it
        this.loadString = d;
        this.fadeOut = false;
      });
    });

    // reset when we get a quit signal
    this.gameService.quitGame$.subscribe(() => {
      if (this.game) {
        this.game.destroy(true);
        this.game = null;
      }

      this.map.next(null);
      this.loadPercent.next('');
    });
  }

  ngOnDestroy(): void {}

  public quitGame() {
    this.socketService.emit(GameServerEvent.QuitGame);
  }

  private initMap() {
    const config = {
      type: Phaser.WEBGL,
      backgroundColor: '#000000',
      parent: document.querySelectorAll('.map')[0] as HTMLElement,
      scale: {
        mode: Phaser.Scale.NONE,
        width: 9 * 64,
        height: 9 * 64
      },
      banner: false
    };

    this.game = new MapRenderGame(
      config,
      this.gameService,
      this.socketService,
      {
        loadPercent: this.loadPercent,
        player: this.currentPlayer,
        map: this.map,
        allPlayers: this.allPlayers,
        allNPCs: this.allNPCs,
        openDoors: this.openDoors,
        ground: this.ground
      }
    );

    this.game.scene.add('PreloadScene', PreloadScene);
    this.game.scene.add('MapScene', MapScene);

    this.game.scene.start('PreloadScene');
  }

}
