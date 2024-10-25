import React from "react";

const Home = () => {
    return (
        <div className="container mt-5">
            <div className="jumbotron text-center bg-light p-5 rounded">
                <h1 className="display-4">Welcome to Task Manager App</h1>
                <p className="lead">Organize, prioritize, and track your tasks with ease.</p>
                <hr className="my-4" />
                <p>
                    Our Task Manager App is designed to help you boost productivity, stay on top of deadlines, 
                    and manage your day-to-day activities seamlessly. Whether you're an individual user looking 
                    to keep your to-dos in order, or a team leader wanting to track tasks for your projects, 
                    this app has everything you need to stay organized.
                </p>
                <p className="lead">
                    <a className="btn btn-primary btn-lg" href="/tasks" role="button">Get Started</a>
                </p>
            </div>
        </div>
    );
};

export default Home;