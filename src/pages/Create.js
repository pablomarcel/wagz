//src/pages/Create.js

import React from 'react';
import '../bootstrap-5.2.3-dist/css/bootstrap.css';
import PetForm from '../components/PetForm';
import PostForm from '../components/PostForm';

const Create = () => {
    return (
        <main>
            <h3>Create Page</h3>
            <section>
                <h4>Add a Pet</h4>
                <PetForm />
            </section>
            <section>
                <h4>Create a Post</h4>
                <PostForm />
            </section>
        </main>
    );
};

export default Create;
