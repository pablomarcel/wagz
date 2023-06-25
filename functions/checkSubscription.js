const neo4j = require('neo4j-driver');
const crypto = require('crypto'); // <-- Require the crypto module

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const checkSubscription = async (hashedEmail, publicFigureId) => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
                MATCH (user:PetOwner {hashEmail: $hashedEmail})-[relationship:SUBSCRIBED_TO]->(publicFigure:PublicFigure {id: $publicFigureId})
                RETURN relationship IS NOT NULL AS isMember
            `,
                { hashedEmail, publicFigureId }
            )
        );

        let isMember = false; // Default to false

        if (result.records.length > 0) {
            const singleRecord = result.records[0];
            isMember = singleRecord.get('isMember');
        }

        return isMember;
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        const { userEmail, publicFigureId } = JSON.parse(event.body);

        // Generate the SHA-256 hash of the email
        const hash = crypto.createHash('sha256');
        hash.update(userEmail);
        const hashedEmail = hash.digest('hex');

        const isMember = await checkSubscription(hashedEmail, publicFigureId);
        return {
            statusCode: 200,
            body: JSON.stringify({ isMember }),
        };
    } catch (error) {
        console.error('Error checking subscription:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to check subscription' }),
        };
    }
};
