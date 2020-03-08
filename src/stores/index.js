import appStore from './appStore';
import {
  accountStore, logStore, roleStore, moduleStore, moduleCategoryStore,
} from '../modules/system';
import { testStore } from '../modules/test';

global.store = appStore;

export default {
  appStore,
  accountStore,
  roleStore,
  logStore,
  testStore,
  moduleStore,
  moduleCategoryStore,
};
