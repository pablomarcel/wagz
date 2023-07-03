export const fetchSearchResults = async (searchString, setPostsSearch) => {
    if(searchString){
        try {
            const response = await fetch('/.netlify/functions/searchTimeline', {
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
            setPostsSearch(searchData);

        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }
};
