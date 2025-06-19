import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const mockTasks = [
  { _id: '1', text: 'Test Task', status: 'todo' }
];

const server = setupServer(
  rest.get('http://localhost:4000/tasks', (req, res, ctx) => res(ctx.json(mockTasks))),
  rest.post('http://localhost:4000/tasks', (req, res, ctx) =>
    res(ctx.json({ _id: '2', text: req.body.text, status: 'todo' }))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('renders tasks and adds a new one', async () => {
  render(<App />);
  expect(await screen.findByText('Test Task')).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText('New task'), {
    target: { value: 'New Task' }
  });

  fireEvent.click(screen.getByText('Add'));

  await waitFor(() => {
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });
});
