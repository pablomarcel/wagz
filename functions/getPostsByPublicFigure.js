const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const fetchPostsByPublicFigure = async (publicFigureId) => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
                MATCH (publicFigure:PublicFigure {id: $publicFigureId})-[:POSTED]->(post:PublicFigurePost)
                RETURN post
            `, { publicFigureId })
        );


        const posts = result.records.map((record) => {
            const postData = record.get('post').properties;
            return {
                id: postData.id,
                title: postData.title,
                content: postData.content,
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
    const { publicFigureId } = body;

    if (!publicFigureId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing publicFigureId' }),
        };
    }

    try {
        const posts = await fetchPostsByPublicFigure(publicFigureId);
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
