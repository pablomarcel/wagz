const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const getCommunity = async (communityId) => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
                MATCH (c:Community { id: $communityId })
                RETURN c
            `, { communityId })
        );

        if (result.records.length === 0) {
            return null;
        }

        const communityData = result.records[0].get('c').properties;

        return {
            id: communityData.id,
            name: communityData.name,
            about: communityData.about,
            fileUrl: communityData.fileUrl
            // Include any other properties your Community nodes might have
        };
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing community id' }),
            };
        }

        const body = JSON.parse(event.body);
        const communityItem = await getCommunity(body.communityId);

        if (!communityItem) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Community not found' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(communityItem),
        };
    } catch (error) {
        console.error('Error fetching community:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch community' }),
        };
    }
};
