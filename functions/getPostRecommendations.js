const neo4j = require('neo4j-driver');
const natural = require('natural');
const TfIdf = natural.TfIdf;

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    const { postId } = JSON.parse(event.body);

    // Create a new instance of TfIdf
    const tfidf = new TfIdf();

    const session = driver.session();
    try {
        // Fetch all posts' captions from the database
        const result = await session.readTransaction((tx) =>
            tx.run("MATCH (post:Post) RETURN post.caption as caption, post.id as id, post.fileUrl as fileUrl")
        );

        const captions = result.records.map(record => ({
            caption: record.get('caption'),
            id: record.get('id'),
            fileUrl: record.get('fileUrl')
        }));

        // Add each caption to the TfIdf instance
        captions.forEach(captionObj => tfidf.addDocument(captionObj.caption));

        const inputPost = captions.find(captionObj => captionObj.id === postId);

        if (!inputPost) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Post not found' }),
            };
        }

        // Get the list of terms in the input post's caption
        const terms = tfidf.listTerms(captions.indexOf(inputPost));

        let scores = [];
        // For each post, calculate the score based on the terms' TfIdf
        captions.forEach((captionObj, i) => {
            if (captionObj.id === postId) return;

            let score = 0;
            terms.forEach(term => {
                score += tfidf.tfidf(term.term, i);
            });

            if (score > 0) {
                scores.push({ id: captionObj.id, score, fileUrl: captionObj.fileUrl, caption: captionObj.caption });
            }

        });

        // Sort by score and return the top 5
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 5);

        return {
            statusCode: 200,
            body: JSON.stringify(scores),
        };
    } catch (error) {
        console.error('Error generating recommendations:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to generate recommendations' }),
        };
    } finally {
        await session.close();
    }
};
