const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const fetchPosts = async (pageNumber = '0', pageSize = 10) => {
    //console.log(`Fetching posts for page: ${pageNumber} with page size: ${pageSize}`);
    const session = driver.session();
    try {
        const pageNumberInt = parseInt(pageNumber, 10);
        //console.log(`pageNumberInt is of type ${typeof pageNumberInt} and its value is ${pageNumberInt}`);

        const skipCount = pageNumberInt * pageSize;
        //console.log(`skipCount is of type ${typeof skipCount} and its value is ${skipCount}`);

        const result = await session.readTransaction((tx) =>
            tx.run(`
                MATCH (post:Post)-[:ABOUT]->(pet:Pet)-[:OWNED_BY]->(owner:PetOwner)
                RETURN post, pet, owner
                ORDER BY post.id DESC
                SKIP toInteger($skipCount)
                LIMIT toInteger($pageSize)
            `, { skipCount, pageSize })
        );

        const posts = result.records.map((record) => {
            const postData = record.get('post').properties;
            const petData = record.get('pet') ? record.get('pet').properties : null;
            const ownerData = record.get('owner') ? record.get('owner').properties : null;

            const post = {
                id: postData.id,
                caption: postData.caption,
                fileUrl: postData.fileUrl,
                pet: petData ? { id: petData.id, name: petData.name } : null,
                owner: ownerData ? { id: ownerData.id, name: ownerData.name, hashEmail: ownerData.hashEmail } : null,
            };
            //console.log(post); // Log each post
            return post;
        });


        //console.log(`Fetched ${posts.length} posts`);
        return posts;
    } catch (error) {
        console.error(`Error in fetchPosts: ${error}`);
        throw error;
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    const { page = '0' } = event.queryStringParameters || {};
    try {
        //console.log(`Handler triggered with page: ${page}`);
        const posts = await fetchPosts(page);
        return {
            statusCode: 200,
            body: JSON.stringify(posts),
        };
    } catch (error) {
        console.error(`Error in handler: ${error}`);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch posts' }),
        };
    }
};
