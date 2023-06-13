const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const fetchPollItems = async () => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run(`
        MATCH (poll:PollQuestion)
        RETURN poll
      `)
        );

        const polls = result.records.map((record) => {
            const pollData = record.get('poll').properties;
            return {
                id: pollData.id,
                author: pollData.author,
                createdDate: pollData.createdDate,
                options: pollData.options,
                question: pollData.question
            };
        });

        return polls;
    } finally {
        await session.close();
    }
};

exports.handler = async (event, context) => {
    try {
        const items = await fetchPollItems();
        return {
            statusCode: 200,
            body: JSON.stringify(items),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch poll items' }),
        };
    }
};
