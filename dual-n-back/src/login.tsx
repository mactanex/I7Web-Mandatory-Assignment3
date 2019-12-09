import React from 'react';
import { useFormik } from 'formik';


export function LoginForm() {

   

    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });
    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="email">Email Address</label><br>
            </br>
            <input
            required
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                value={formik.values.email}
            /><br></br>
            <label htmlFor="password">Password</label>
            <br></br>
            <input
            required
                id="password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
            /><br></br>
            <button type="submit">Login</button>
        </form>
    );
};