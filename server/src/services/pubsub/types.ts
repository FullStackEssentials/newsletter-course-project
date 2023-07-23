export interface PubSubService {
  publish(topicId: string, payload: Record<string, unknown>): Promise<string>;
  validatePayload(payload: Record<string, any>): boolean;
}
