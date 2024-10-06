import React from "react";

const Signup = () => {
    return (
        <div>
            <h1> Signup Page </h1>
            <form>
                <div>
                    <label> Username </label>
                    <input type = "text" />
                </div>
                <div>
                    <label> Password </label>
                    <input type="password" />
                </div>
                <button type="submit"> Sign Up </button>
            </form>
        </div>
    );
};


export default Signup;