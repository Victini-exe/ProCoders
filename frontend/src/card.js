import React from 'react';

export const Card = ({ children }) => (

<div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}> {children} </div> );
export const CardContent = ({ children }) => (

<div>{children}</div> );
