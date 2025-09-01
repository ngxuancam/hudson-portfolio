type ScrollData = {
  scrollY: number;
  direction: 'up' | 'down';
};

type ScrollListener = (data: ScrollData) => void;

class BrowserEventEmitter {
  private listeners: Map<string, Set<ScrollListener>> = new Map();

  on(event: string, listener: ScrollListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(listener);
  }

  off(event: string, listener: ScrollListener) {
    this.listeners.get(event)?.delete(listener);
  }

  emit(event: string, data: ScrollData) {
    this.listeners.get(event)?.forEach(listener => listener(data));
  }
}

export const scrollEmitter = new BrowserEventEmitter();
export const SCROLL_EVENT = 'scroll';

export const emitScroll = (scrollData: ScrollData) => {
  scrollEmitter.emit(SCROLL_EVENT, scrollData);
};
