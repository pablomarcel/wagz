export const fetchSearchResults = async (searchString, setSearchResults) => {
    if(searchString){
        try {
            const response = await fetch('/.netlify/functions/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ searchInput: searchString }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }

            const searchData = await response.json();

            setSearchResults(searchData.map(post => post.id));
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }
};
