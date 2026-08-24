import * as migration_20260824_092209_initial from './20260824_092209_initial';

export const migrations = [
  {
    up: migration_20260824_092209_initial.up,
    down: migration_20260824_092209_initial.down,
    name: '20260824_092209_initial'
  },
];
