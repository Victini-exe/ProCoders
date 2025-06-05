import React from 'react';

export const Button = ({ children, onClick }) => (
<button onClick={onClick} style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#007bff', color: '#fff', border: 'none' }}>
{children}
</button>
);