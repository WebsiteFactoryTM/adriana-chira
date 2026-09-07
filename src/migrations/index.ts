import * as migration_20260824_092209_initial from './20260824_092209_initial';
import * as migration_20260907_125106_workshopuri_recomandari_ron from './20260907_125106_workshopuri_recomandari_ron';
import * as migration_20260907_135248_rol_optional_la_recomandari from './20260907_135248_rol_optional_la_recomandari';

export const migrations = [
  {
    up: migration_20260824_092209_initial.up,
    down: migration_20260824_092209_initial.down,
    name: '20260824_092209_initial',
  },
  {
    up: migration_20260907_125106_workshopuri_recomandari_ron.up,
    down: migration_20260907_125106_workshopuri_recomandari_ron.down,
    name: '20260907_125106_workshopuri_recomandari_ron',
  },
  {
    up: migration_20260907_135248_rol_optional_la_recomandari.up,
    down: migration_20260907_135248_rol_optional_la_recomandari.down,
    name: '20260907_135248_rol_optional_la_recomandari'
  },
];
