const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const updateSubscriptionInDatabase = async (client_reference_id) => {
    const session = driver.session();
    try {
        // Replace this with the actual query to update your database
        const result = await session.writeTransaction((tx) =>
            tx.run(`
          MATCH (owner:PetOwner { id: $client_reference_id })
          SET owner.hasActiveSubscription = true
          RETURN owner
      `, { client_reference_id })
        );
        if (result.records.length === 0) {
            console.error("Failed to update subscription status for owner:", client_reference_id);
        } else {
            console.log("Updated subscription status for owner:", client_reference_id);
        }
    } finally {
        await session.close();
    }
};

exports.handler = async ({ body, headers }, context) => {
    let event;
    const rawBody = Buffer.from(body, 'utf8').toString();

    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            headers["stripe-signature"],
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return {
            statusCode: 400,
            body: `Webhook Error: ${err.message}`
        };
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        await updateSubscriptionInDatabase(session.client_reference_id);
    }

    // Return a 200 response to acknowledge receipt of the event
    return {
        statusCode: 200,
        body: JSON.stringify({ received: true }),
    };
};
