import React, {
  useContext,
  useRef,
  useReducer
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

const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';

const todosReducer = (state, action) => {
  switch(action.type) {
    case ADD_TODO:
      return [{done: false, value: action.payload}, ...state];
    case TOGGLE_TODO:
      const newState = [...state];
      newState[action.payload].done = !newState[action.payload].done;
      return newState;
    default:
      return state;
  }
}

const Dash = () => {
  const { user, identity } = useContext(IdentityContext);
  const inputRef = useRef();
  const [todos, dispatch] = useReducer(todosReducer, []);
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
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({type: ADD_TODO, payload: inputRef.current.value});
          inputRef.current.value = '';
        }}
      >
        <Label sx={{ display: 'flex', alignItems: 'center' }}>
          <span>Add&nbsp;Todo</span>
          <Input ref={inputRef} sx={{ marginLeft: 1 }} />
          <Button sx={{ marginLeft: 1 }}>Submit</Button>
        </Label>
      </Flex>
      <ul style={{ listStyleType: 'none' }}>
        {todos.map((t, i) => (
          <Flex
            as="li"
            key={i}
            sx={{ alignItems: 'center', cursor: 'pointer' }}
            onClick={() => {
              dispatch({type: TOGGLE_TODO, payload: i})
            }}
          >
            <Checkbox checked={t.done} sx={{ paddingRight: 1 }}/>
            <span>{t.value}</span>
          </Flex>
        ))}
      </ul>
    </Container>
  )
};

export default Dash;
