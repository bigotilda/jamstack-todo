import React, {
  useContext,
  useRef,
  useState
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

const Dash = () => {
  const { user, identity } = useContext(IdentityContext);
  const inputRef = useRef();
  const [todos, setTodos] = useState([]);
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
          setTodos([{done: false, value: inputRef.current.value}, ...todos]);
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
            sx={{ alignItems: 'center' }}
            onClick={() => {
              const theTodo = todos[i];
              theTodo.done = !theTodo.done;
              setTodos([...todos.slice(0, i), theTodo, ...todos.slice(i+1)]);
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
