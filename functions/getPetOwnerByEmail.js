const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const getPetOwnerByEmail = async (email) => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
                MATCH (owner:PetOwner {email: $email})
                RETURN owner
            `, { email })
        );

        const ownerData = result.records.map((record) => {
            const owner = record.get('owner').properties;
            return {
                id: owner.id,
                name: owner.name,
                email: owner.email,
                bio: owner.bio,
                fileUrl: owner.fileUrl,
                hasActiveSubscription: owner.hasActiveSubscription
            };
        });

        return ownerData;
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    const { email } = JSON.parse(event.body);

    try {
        const ownerData = await getPetOwnerByEmail(email);
        return {
            statusCode: 200,
            body: JSON.stringify(ownerData),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch pet owner data' }),
        };
    }
};
