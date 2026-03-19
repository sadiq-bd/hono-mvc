type EventCallback<T = any> = (payload: T) => void | Promise<void>;

export class EventDispatcher {
  private static events: Map<string, EventCallback[]> = new Map();

  /**
   * Register a listener for a specific event
   */
  public static on<T = any>(event: string, callback: EventCallback<T>) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  /**
   * Dispatch an event with an optional payload
   */
  public static async dispatch<T = any>(event: string, payload?: T) {
    const callbacks = this.events.get(event);
    if (!callbacks) return;

    // Execute all listeners parallelly/asynchronously
    const promises = callbacks.map((cb) => {
      try {
        return Promise.resolve(cb(payload as T));
      } catch (error) {
        console.error(`[EventDispatcher] Error in listener for event '${event}':`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Remove a specific listener or all listeners for an event
   */
  public static off(event: string, callback?: EventCallback) {
    if (!callback) {
      this.events.delete(event);
      return;
    }

    const callbacks = this.events.get(event);
    if (callbacks) {
      this.events.set(
        event,
        callbacks.filter((cb) => cb !== callback)
      );
    }
  }
}

// Laravel-like shorthand alias for dispatching
export const event = EventDispatcher.dispatch.bind(EventDispatcher);
