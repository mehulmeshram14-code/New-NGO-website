import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWebhookEvent extends Document {
  eventId: string;
  eventType: string;
  orderId?: string;
  paymentId?: string;
  processedAt: Date;
  payload?: Record<string, unknown>;
}

const WebhookEventSchema = new Schema<IWebhookEvent>(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    eventType: { type: String, required: true, index: true },
    orderId: { type: String, index: true },
    paymentId: { type: String, index: true },
    processedAt: { type: Date, default: Date.now },
    payload: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

const WebhookEvent: Model<IWebhookEvent> =
  mongoose.models.WebhookEvent || mongoose.model<IWebhookEvent>("WebhookEvent", WebhookEventSchema);

export default WebhookEvent;
