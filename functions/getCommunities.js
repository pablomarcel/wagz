const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const fetchCommunities = async () => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
        MATCH (c:Community)
        RETURN c
      `)
        );

        console.log('Query result:', result.records);

        const communities = result.records.map((record) => {
            const communityData = record.get('c').properties;
            return {
                id: communityData.id,
                name: communityData.name,
                about: communityData.about,
                fileUrl: communityData.fileUrl
            };
        });

        return communities;
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        const items = await fetchCommunities();
        return {
            statusCode: 200,
            body: JSON.stringify(items),
        };
    } catch (error) {
        console.error('Error fetching communities:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch communities' }),
        };
    }
};
