import { describe, it } from 'vitest';
import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';

import Index, { WELCOME_TITLE_TEST_ID } from '../_index';

describe('Index Route', () => {
  it('renders index page content', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: Index,
      },
    ]);

    render(<RemixStub />);

    await waitFor(
      () => screen.getByTestId(WELCOME_TITLE_TEST_ID) !== undefined,
    );
  });
});
