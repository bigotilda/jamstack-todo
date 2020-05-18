import React, {
  useContext,
  useRef
} from 'react';
import { Link } from '@reach/router';
import {
  Container,
  Flex,
  NavLink,
  Input,
  Label,
  Button,
  Checkbox
} from 'theme-ui';
import { IdentityContext } from '../../identity-context';
import { 
  gql,
  useMutation,
  useQuery
} from '@apollo/client';

const ADD_TODO = gql`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      id
    }
  }
`;

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      text
      done
    }
  }
`;

const UPDATE_TODO_DONE = gql`
  mutation UpdateTodoDone($id: ID!) {
    updateTodoDone(id: $id) {
      text
      done
    }
  }
`;

const Dash = () => {
  const { user, identity } = useContext(IdentityContext);
  const inputRef = useRef();
  const [addTodo] = useMutation(ADD_TODO);
  const { loading, error, data, refetch } = useQuery(GET_TODOS);
  const [updateTodoDone] = useMutation(UPDATE_TODO_DONE);
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
      <Flex
        as="form"
        onSubmit={async (e) => {
          e.preventDefault();
          const todoText = inputRef.current.value;
          inputRef.current.value = '';
          await addTodo({variables: { text: todoText }});
          await refetch();
        }}
      >
        <Label sx={{ display: 'flex', alignItems: 'center' }}>
          <span>Add&nbsp;Todo</span>
          <Input ref={inputRef} sx={{ marginLeft: 1 }} />
          <Button sx={{ marginLeft: 1 }}>Submit</Button>
        </Label>
      </Flex>
      <Flex sx={{ flexDirection: "column" }}>
        {loading ? <div>Loading...</div> : null}
        {error ? <div>{error.message}</div> : null}
        {!loading && !error && (
          <ul style={{ listStyleType: 'none' }}>
            {data.todos.map((t) => (
              <Flex
                as="li"
                key={t.id}
                sx={{ alignItems: 'center', cursor: 'pointer' }}
                onClick={async () => {
                  await updateTodoDone({ variables: {id: t.id} });
                  await refetch();
                }}
              >
                <Checkbox checked={t.done} sx={{ paddingRight: 1 }} readOnly />
                <span>{t.text}</span>
              </Flex>
            ))}
          </ul>
        )}
      </Flex>
    </Container>
  )
};

export default Dash;
