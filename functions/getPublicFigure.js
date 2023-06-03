const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const getPublicFigure = async (publicFigureId) => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
                MATCH (p:PublicFigure { id: $publicFigureId })
                RETURN p
            `, { publicFigureId })
        );

        console.log('Query result:', result.records);

        if (result.records.length === 0) {
            return null;
        }

        const publicFigureData = result.records[0].get('p').properties;

        return {
            id: publicFigureData.id,
            name: publicFigureData.name,
            bio: publicFigureData.bio,
            occupation: publicFigureData.occupation,
            imageUrl: publicFigureData.imageUrl,
            birthDate: publicFigureData.birthDate,
            birthPlace: publicFigureData.birthPlace,
            nationality: publicFigureData.nationality,
            knownFor: publicFigureData.knownFor
            // Include any other properties your PublicFigure nodes might have
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
                body: JSON.stringify({ error: 'Missing public figure id' }),
            };
        }

        const body = JSON.parse(event.body);
        const publicFigureItem = await getPublicFigure(body.publicFigureId);

        if (!publicFigureItem) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Public figure not found' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(publicFigureItem),
        };
    } catch (error) {
        console.error('Error fetching public figure:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch public figure' }),
        };
    }
};
