export interface DomainEvent {
  eventId: string;
  type: string;
  payload: unknown;
  aggregateId: string;
  userId?: string;
  source: string;
  timestamp: Date;
}

export type EventHandler<T = unknown> = (event: DomainEvent & { payload: T }) => Promise<void>;
