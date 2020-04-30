import React, { useContext } from 'react';
import { Router, Link } from '@reach/router';
import {
  Container,
  Flex,
  Heading,
  Button,
  NavLink
} from 'theme-ui';
import { IdentityContext } from '../../identity-context';

const Dash = () => {
  const { user, identity } = useContext(IdentityContext);
  return (
    <Container>
      <Flex as="nav">
        <NavLink as={Link} to="/" p={2}>
          Home
        </NavLink>
        <NavLink as={Link} to="/app" p={2}>
          Dashboard
        </NavLink>
        {user && (
          <NavLink
            href="#!"
            p={2}
            onClick={() => {
              identity.logout();
            }}
          >
            Log out {user.user_metadata.full_name}
          </NavLink>
        )}
      </Flex>
      <span>Dash hasUser: {user && user.user_metadata.full_name}</span>
    </Container>
  )
};

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
