import { pool } from '../connection';

export interface PaymentRecord {
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
  metadata?: Record<string, unknown>;
}

export const paymentRepository = {
  async createPayment(data: PaymentRecord) {
    const query = `
      INSERT INTO payments (stripe_payment_intent_id, amount, currency, status, metadata)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (stripe_payment_intent_id) DO UPDATE SET
        status = EXCLUDED.status,
        metadata = EXCLUDED.metadata,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const values = [
      data.stripePaymentIntentId,
      data.amount,
      data.currency,
      data.status,
      data.metadata ? JSON.stringify(data.metadata) : null,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getPaymentByStripeId(stripePaymentIntentId: string) {
    const result = await pool.query(
      'SELECT * FROM payments WHERE stripe_payment_intent_id = $1',
      [stripePaymentIntentId]
    );
    return result.rows[0] || null;
  },

  async updatePaymentStatus(
    stripePaymentIntentId: string,
    status: string,
    metadata?: Record<string, unknown>
  ) {
    const result = await pool.query(
      `UPDATE payments
       SET status = $2,
           metadata = COALESCE($3, metadata),
           updated_at = CURRENT_TIMESTAMP
       WHERE stripe_payment_intent_id = $1
       RETURNING *`,
      [stripePaymentIntentId, status, metadata ? JSON.stringify(metadata) : null]
    );
    return result.rows[0] || null;
  },

  async isEventProcessed(eventId: string) {
    const result = await pool.query(
      'SELECT 1 FROM processed_webhook_events WHERE event_id = $1',
      [eventId]
    );
    return (result.rowCount ?? 0) > 0;
  },

  async markEventProcessed(eventId: string, type: string) {
    await pool.query(
      `INSERT INTO processed_webhook_events (event_id, event_type)
       VALUES ($1, $2)
       ON CONFLICT (event_id) DO NOTHING`,
      [eventId, type]
    );
  },
};
