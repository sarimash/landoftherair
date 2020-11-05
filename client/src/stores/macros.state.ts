
import { Injectable } from '@angular/core';
import { ImmutableContext } from '@ngxs-labs/immer-adapter';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

import * as macros from '../assets/content/_output/macros.json';

import { IMacroBar, IMacroContainer } from '../interfaces';
import { CreateCustomMacro, DeleteCustomMacro, PlayerReady,
  SetActiveMacro, SetActiveMacroBars, SetDefaultMacros, SetMacroBars } from './actions';
import { GameState } from './game.state';


const defaultMacros: () => IMacroContainer = () => {
  return {
    activeMacroBars: {},
    activeMacros: {},
    customMacros: {},
    characterMacros: {}
  };
};

@State<IMacroContainer>({
  name: 'macros',
  defaults: defaultMacros()
})
@Injectable()
export class MacrosState {

  @Selector()
  static allMacros(state: IMacroContainer) {
    return Object.assign({}, state.customMacros, macros);
  }

  @Selector()
  static activeMacros(state: IMacroContainer) {
    return state.activeMacros;
  }

  @Selector()
  static customMacros(state: IMacroContainer) {
    return state.customMacros;
  }

  @Selector()
  static characterMacros(state: IMacroContainer) {
    return state.characterMacros;
  }

  constructor(private store: Store) {}

  @Action(CreateCustomMacro)
  createCustomMacro(ctx: StateContext<IMacroContainer>, { macro }: CreateCustomMacro) {
    const state = ctx.getState();

    const copyMacros = { ... state.customMacros };
    copyMacros[macro.name] = macro;

    ctx.patchState({ customMacros: copyMacros });
  }

  @Action(DeleteCustomMacro)
  deleteCustomMacro(ctx: StateContext<IMacroContainer>, { macro }: DeleteCustomMacro) {
    const state = ctx.getState();

    const copyMacros = { ... state.customMacros };
    delete copyMacros[macro.name];

    ctx.patchState({ customMacros: copyMacros });
  }

  @Action(SetActiveMacro)
  @ImmutableContext()
  setActiveMacro({ setState }: StateContext<IMacroContainer>, { macroName }: SetActiveMacro) {
    const curPlayer = this.store.selectSnapshot(GameState.player);

    setState((state: IMacroContainer) => {
      state.activeMacros = state.activeMacros ?? {};
      state.activeMacros[curPlayer.username] = state.activeMacros[curPlayer.username] ?? {};
      state.activeMacros[curPlayer.username][curPlayer.charSlot] = macroName;

      return state;
    });
  }

  @Action(SetActiveMacroBars)
  @ImmutableContext()
  setActiveMacroBars({ setState }: StateContext<IMacroContainer>, { macroBarNames }: SetActiveMacroBars) {
    const curPlayer = this.store.selectSnapshot(GameState.player);

    setState((state: IMacroContainer) => {
      state.activeMacroBars = state.activeMacroBars ?? {};
      state.activeMacroBars[curPlayer.username] = state.activeMacroBars[curPlayer.username] ?? {};
      state.activeMacroBars[curPlayer.username][curPlayer.charSlot] = macroBarNames;

      return state;
    });
  }

  @Action(SetMacroBars)
  @ImmutableContext()
  setMacroBars({ setState }: StateContext<IMacroContainer>, { macroBars }: SetMacroBars) {
    const curPlayer = this.store.selectSnapshot(GameState.player);

    setState((state: IMacroContainer) => {
      state.characterMacros = state.characterMacros ?? {};
      state.characterMacros[curPlayer.username] = state.characterMacros[curPlayer.username] ?? {};
      state.characterMacros[curPlayer.username][curPlayer.charSlot] = {};

      macroBars.forEach(bar => state.characterMacros[curPlayer.username][curPlayer.charSlot][bar.name] = bar);

      return state;
    });
  }

  @Action(PlayerReady)
  playGame(ctx: StateContext<IMacroContainer>) {
    const state = ctx.getState();

    const curPlayer = this.store.selectSnapshot(GameState.player);

    // if we have no macros, make the default setup
    const macroBars = state.characterMacros?.[curPlayer.username]?.[curPlayer.charSlot];
    if (Object.keys(macroBars || {}).length === 0) {
      this.store.dispatch(new SetDefaultMacros());
    }
  }

  @Action(SetDefaultMacros)
  setDefaultMacros() {
    const defaultMacroBar: IMacroBar = {
      macros: ['Attack', 'Search', 'Drink', 'Stairs', 'Climb', 'Restore'],
      name: 'default'
    };

    this.store.dispatch(new SetMacroBars([defaultMacroBar]))
      .subscribe(() => {
        this.store.dispatch(new SetActiveMacroBars(['default']))
        .subscribe(() => {
          this.store.dispatch(new SetActiveMacro('Attack'));
        });
      });
  }

}
