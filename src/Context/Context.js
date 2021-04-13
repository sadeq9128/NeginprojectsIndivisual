import React from 'react';

const UserContext = React.createContext({
    userData: [],
    addData: (userData) => { },
  });

export default UserContext;