import { PubSubService } from "./types";

export class TestPubSub implements PubSubService {
  validatePayload(payload: Record<string, any>): boolean {
    return !!payload;
  }

  publish(topicId: string, payload: Record<string, unknown>): Promise<string> {
    console.log(payload);
    return Promise.resolve(`Published to ${topicId} successfully!`);
  }
}
