/** Integration coverage verifies real keyboard input, errors, and honest local-only feedback. */
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DemoForm from './DemoForm';

afterEach(cleanup);
it('focuses the invalid field and completes a contact preview without sending a request', async () => {
  const user = userEvent.setup();
  const fetch = vi.spyOn(window, 'fetch');
  render(<DemoForm />);
  await user.click(screen.getByRole('button', { name: /preview message/i }));
  expect(document.activeElement).toBe(screen.getByLabelText('Your name'));
  await user.type(screen.getByLabelText('Your name'), 'Demo Guest');
  await user.type(screen.getByLabelText('Email address'), 'demo@example.com');
  await user.type(screen.getByLabelText('Subject'), 'Demo inquiry');
  await user.type(
    screen.getByLabelText('Your message'),
    'An entirely fictional message for this test.',
  );
  await user.click(screen.getByRole('button', { name: /preview message/i }));
  expect(screen.getByRole('status').textContent).toContain('your message has not been sent');
  expect(fetch).not.toHaveBeenCalled();
});
