import React, { useContext } from 'react';
import { Router } from '@reach/router';
import {
  Flex,
  Heading,
  Button,
} from 'theme-ui';
import { IdentityContext } from '../../identity-context';
import Dash from '../components/dashboard';

const DashLoggedOut = (props) => {
  const { identity } = useContext(IdentityContext);
  return (
    <Flex sx={{ flexDirection: 'column', padding: 3 }}>
      <Heading as='h1'>Get Stuff Done</Heading>
      <Button
        sx={{ marginTop: 2 }}
        onClick={() => {
          identity.open();
        }}
      >
        Log In
      </Button>
    </Flex>
  );
};

export default (props) => {
  const { user } = useContext(IdentityContext);

  if (!user) {
    return (
      <Router>
        <DashLoggedOut path="/app" />
      </Router>
    )
  }
  return (
    <Router>
      <Dash path="/app" />
    </Router>
  )
}
