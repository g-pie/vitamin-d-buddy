import React from 'react';
import ReactDOM from 'react-dom';
import Game from './game.jsx';

ReactDOM.render(
    // <Game url="[API ROUTE]" />,
    <Game url="/api/v1/tasks/" />,
    document.getElementById('reactEntry'),
);