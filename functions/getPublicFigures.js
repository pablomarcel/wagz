const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const fetchPublicFigures = async () => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
        MATCH (p:PublicFigure)
        RETURN p
      `)
        );

        const publicFigures = result.records.map((record) => {
            const publicFigureData = record.get('p').properties;
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
            };
        });

        return publicFigures;
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        const items = await fetchPublicFigures();
        return {
            statusCode: 200,
            body: JSON.stringify(items),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch public figures' }),
        };
    }
};
