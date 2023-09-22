import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@chakra-ui/icons'

export const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">
            <ArrowLeftIcon />
          </Link>
        </li>
      </ul>
    </nav>
  );
};
