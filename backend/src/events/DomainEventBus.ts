import { DomainEvent, EventHandler } from './types';

export class DomainEventBus {
  private listeners: Map<string, EventHandler[]> = new Map();

  register<T>(eventType: string, handler: EventHandler<T>): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(handler as EventHandler);
  }

  async emit(event: DomainEvent): Promise<void> {
    const handlers = this.listeners.get(event.type) || [];
    // Synchrone bloquant: on attend chaque handler séquentiellement (ou en parallèle via Promise.all)
    // L'orchestrateur a demandé "await chaque handler", donc séquentiel.
    for (const handler of handlers) {
      await handler(event);
    }
  }
}
