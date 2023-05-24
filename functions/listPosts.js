const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const fetchPosts = async () => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
        MATCH (post:Post)-[:ABOUT]->(pet:Pet)-[:OWNED_BY]->(owner:PetOwner)
        RETURN post, pet, owner
      `)
        );

        console.log('Query result:', result.records);

        const posts = result.records.map((record) => {
            const postData = record.get('post').properties;
            const petData = record.get('pet') ? record.get('pet').properties : null;
            const ownerData = record.get('owner') ? record.get('owner').properties : null;

            return {
                id: postData.id,
                caption: postData.caption,
                pet: petData ? { id: petData.id, name: petData.name } : null,
                owner: ownerData ? { id: ownerData.id, name: ownerData.name, email: ownerData.email } : null, // include email in the owner object
            };
        });

        return posts;
    } finally {
        await session.close();
    }
};


exports.handler = async (event, context) => {
    try {
        const posts = await fetchPosts();
        return {
            statusCode: 200,
            body: JSON.stringify(posts),
        };
    } catch (error) {
        console.error('Error fetching posts:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch posts' }),
        };
    }
};
