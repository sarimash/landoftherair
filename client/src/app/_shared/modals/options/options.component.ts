import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { GameOption } from '../../../../interfaces';
import { SetOption, SettingsState } from '../../../../stores';
import { OptionsService } from '../../../services/options.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit, OnDestroy {

  @Select(SettingsState.options) options$: Observable<any>;

  public options: any = {};

  public readonly debugOptions = [
    { option: GameOption.DebugUI,                     text: 'Show debug info in the interface' }
  ];

  public readonly interactionOptions = [
    { option: GameOption.RightClickCMDSend,           text: 'Right-click to send command line' },
    { option: GameOption.EnterToggleCMD,              text: 'Use Enter to toggle command line visibility' },
    { option: GameOption.NoNPCModals,                 text: 'Classic NPC chat (no dialog popups)' },
    { option: GameOption.AutoAttack,                  text: 'Auto-attack while there is an active target' },
    { option: GameOption.AutoJoin,                    text: 'Join the game with the last character used' },
    { option: GameOption.DontAttackGreys,             text: 'Do not attack grey-tags automatically' },
  ];

  public readonly messageOptions = [
    { option: GameOption.HideLobbyWhilePlaying,       text: 'Hide lobby while in game' },
    { option: GameOption.SuppressZeroDamage,          text: 'Suppress 0-damage messages' },
    { option: GameOption.SuppressOutgoingDoT,         text: 'Suppress outgoing DoT damage' },
    { option: GameOption.SendBannerMessagesToChat,    text: 'Send banner messages to chat window as well as banner' },
  ];

  public readonly uiOptions = [
    { option: GameOption.LockWindows,                 text: 'Lock all window positions' },
    { option: GameOption.NoItemAnimations,            text: 'Stop item animations' },
    { option: GameOption.ShrinkCharacterBoxes,        text: 'Shrink character boxes to health + name only' },
    { option: GameOption.LockerTabs,                  text: 'Locker will be tabs instead of dropdown' },
    { option: GameOption.BiggerGroundWindow,          text: 'Ground will be 2 rows on top and bottom' },
    { option: GameOption.ShowHPValueInsteadOfPercent, text: 'Show HP value instead of percent' },
    // { option: GameOption.PinLastTarget,            text: 'Pin last target click position' },
  ];

  public readonly spritesheets = [
    'Decor',
    'Walls',
    'Items',
    'Creatures',
    'Swimming',
    'Terrain',
    'Effects'
  ];

  constructor(
    private store: Store,
    private optionsService: OptionsService,
    public dialogRef: MatDialogRef<OptionsComponent>
  ) { }

  ngOnInit() {
    this.options$.pipe(first())
      .subscribe(opts => {
        this.options = Object.assign({}, opts);
      });
  }

  ngOnDestroy() {}

  public updateOption(option) {
    this.store.dispatch(new SetOption(option as GameOption, this.options[option]));

    if (option === GameOption.CustomCSS) {
      this.optionsService.updateCustomCSS();
    }
  }

}
