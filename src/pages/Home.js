//src/pages/Home.js:

import React from 'react';
import '../bootstrap-5.2.3-dist/css/bootstrap.css';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';

const Home = () => {
    return (
        <main>
            <h3>Home Page</h3>
            <section>
                <h4>Create a Post</h4>
                <PostForm />
            </section>
            <section>
                <h4>Posts</h4>
                <PostList />
            </section>
        </main>
    );
};

export default Home;

