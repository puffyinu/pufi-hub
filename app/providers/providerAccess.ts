import {
  getProvider,
} from "./dataProvider";

import type {
  DataProvider,
} from "./providerTypes";

export function provider(): DataProvider {
  return getProvider();
}