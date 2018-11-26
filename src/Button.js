import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import {library} from '@fortawesome/fontawesome-svg-core'
import {faStroopwafel} from '@fortawesome/free-solid-svg-icons'
library.add(faStroopwafel);

const Button = ({className, onClick, children}) =>
    <button className={className} onClick={onClick}>
        {children}
    </button>;

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

Button.defaultProps = {
    className: '',
};


export default Button;