import { DomainEventBus } from '../../../src/events/DomainEventBus';
import { DomainEvent } from '../../../src/events/types';

describe('DomainEventBus', () => {
  let eventBus: DomainEventBus;

  beforeEach(() => {
    eventBus = new DomainEventBus();
  });

  it('should register listeners and trigger them on emit', async () => {
    let triggeredCount = 0;
    const mockHandler = async (event: DomainEvent) => {
      triggeredCount++;
      expect(event.type).toBe('TEST_EVENT');
    };

    eventBus.register('TEST_EVENT', mockHandler);
    
    await eventBus.emit({
      eventId: '1',
      type: 'TEST_EVENT',
      payload: {},
      aggregateId: 'test-id',
      source: 'test',
      timestamp: new Date()
    });

    expect(triggeredCount).toBe(1);
  });

  it('should support multiple listeners for the same event', async () => {
    const results: number[] = [];
    
    eventBus.register('MULTI_TEST', async () => { results.push(1); });
    eventBus.register('MULTI_TEST', async () => { results.push(2); });

    await eventBus.emit({
      eventId: '2',
      type: 'MULTI_TEST',
      payload: {},
      aggregateId: 'multi-id',
      source: 'test',
      timestamp: new Date()
    });

    expect(results).toEqual([1, 2]);
  });
});
