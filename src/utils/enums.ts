export enum PageLoadState {
  LOAD = 'load',
  DOM_CONTENT_LOADED = 'domcontentloaded',
  NETWORK_IDLE = 'networkidle',
}

export enum ElementState {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
  ATTACHED = 'attached',
  DETACHED = 'detached',
}

export enum Timeout {
  ONE_SECOND = 1000,
  TWO_SECOND = 2000,
  MINI_WAIT = 3000,
  SHORT = 5000,
  SHORT_MEDIUM = 8000,
  MEDIUM = 10000,
  MEDIUM_LONG = 20000,
  LONG = 30000,
  ONE_MINUTE = 60000,
  EXTRA_LONG = 80000,
}
