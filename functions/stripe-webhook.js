const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const updateSubscriptionInDatabase = async (client_reference_id) => {
    if (!client_reference_id) {
        console.error("client_reference_id is null or undefined");
        return;
    }

    // Decompose client_reference_id
    const [petOwnerEmail, publicFigureId] = client_reference_id.split("#");
    console.log("petOwnerEmail:", petOwnerEmail);
    console.log("publicFigureId:", publicFigureId);

    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run(`
                MATCH (owner:PetOwner {email: $petOwnerEmail})
                MATCH (figure:PublicFigure {id: $publicFigureId})
                MERGE (owner)-[:HAS_SUBSCRIBED_TO]->(figure)
                RETURN owner, figure
            `,
                { petOwnerEmail, publicFigureId }
            )
        );
        console.log("Database transaction result:", result);

        if (result.records.length === 0) {
            console.error("Failed to update subscription status for owner:", petOwnerEmail, "and public figure:", publicFigureId);
        } else {
            console.log("Updated subscription status for owner:", petOwnerEmail, "and public figure:", publicFigureId);
        }
    } catch (error) {
        console.error("Error updating database:", error);
    } finally {
        await session.close();
    }
};

exports.handler = async ({ body, headers }, context) => {
    let event;
    const rawBody = Buffer.from(body, 'utf8').toString();
    console.log('Body:', rawBody.substring(0, 200), '...'); // Only log first 200 characters
    console.log('Stripe-signature:', headers["stripe-signature"].substring(0, 5), '...'); // Only log first 5 characters
    console.log('Webhook secret:', process.env.STRIPE_WEBHOOK_SECRET.substring(0, 5), '...'); // Only log first 5 characters

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
        console.log("client_reference_id:", session.client_reference_id);
        await updateSubscriptionInDatabase(session.client_reference_id);
    }

    // Return a 200 response to acknowledge receipt of the event
    return {
        statusCode: 200,
        body: JSON.stringify({ received: true }),
    };
};
