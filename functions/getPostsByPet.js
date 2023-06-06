const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const fetchPostsByPet = async (petId) => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
                MATCH (post:Post)-[:ABOUT]->(pet:Pet {id: $petId})
                RETURN post
            `, { petId })
        );

        const posts = result.records.map((record) => {
            const postData = record.get('post').properties;
            return {
                id: postData.id,
                caption: postData.caption,
                fileUrl: postData.fileUrl,
            };
        });

        return posts;
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    const body = JSON.parse(event.body);
    const { petId } = body;

    if (!petId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing petId' }),
        };
    }

    try {
        const posts = await fetchPostsByPet(petId);
        return {
            statusCode: 200,
            body: JSON.stringify(posts),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch posts' }),
        };
    }
};
