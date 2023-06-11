const neo4j = require('neo4j-driver');
const natural = require('natural');
const TfIdf = natural.TfIdf;

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

exports.handler = async (event, context) => {
    const { petId } = JSON.parse(event.body);

    // Create a new instance of TfIdf
    const tfidf = new TfIdf();

    const session = driver.session();
    try {
        // Fetch all pets' bios from the database
        const result = await session.readTransaction((tx) =>
            tx.run("MATCH (pet:Pet) RETURN pet.bio as bio, pet.id as id, pet.fileUrl as fileUrl, pet.name as name, pet.breed as breed, pet.age as age")
        );

        const bios = result.records.map(record => ({
            bio: record.get('bio'),
            id: record.get('id'),
            fileUrl: record.get('fileUrl'),
            name: record.get('name'),
            breed: record.get('breed'),
            age: record.get('age')
        }));

        // Add each bio to the TfIdf instance
        bios.forEach(bioObj => tfidf.addDocument(bioObj.bio));

        const inputPet = bios.find(bioObj => bioObj.id === petId);

        if (!inputPet) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Pet not found' }),
            };
        }

        // Get the list of terms in the input pet's bio
        const terms = tfidf.listTerms(bios.indexOf(inputPet));

        let scores = [];
        // For each pet, calculate the score based on the terms' TfIdf
        bios.forEach((bioObj, i) => {
            if (bioObj.id === petId) return;

            let score = 0;
            terms.forEach(term => {
                score += tfidf.tfidf(term.term, i);
            });

            if (score > 0) {
                scores.push({ id: bioObj.id, score, fileUrl: bioObj.fileUrl, bio: bioObj.bio, name: bioObj.name, breed: bioObj.breed, age: bioObj.age });
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
