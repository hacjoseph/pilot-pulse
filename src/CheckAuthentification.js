import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const CheckAuthentification = ({ component: Component, ...rest }) => {

    const isAuthenticated = () => {
      const token = localStorage.getItem('token');
      return !!token; 
    };
    return (
        <Route
        {...rest}
        render={(props) =>
            isAuthenticated() ? (
            <Component {...props} />
            ) : (
            <Redirect to="/login" />
            )
        }
        />
    );
    };

export default CheckAuthentification;
