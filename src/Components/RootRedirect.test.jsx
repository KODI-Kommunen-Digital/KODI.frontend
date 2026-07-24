import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock cookieServices before importing RootRedirect
const mockGetCookie = jest.fn();
jest.mock('../cookies/cookieServices', () => ({
  getCookie: (...args) => mockGetCookie(...args),
}));

import RootRedirect from './RootRedirect';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to, replace }) => <div data-testid="navigate" data-to={to} data-replace={String(replace)} />,
  };
});

describe('RootRedirect', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    mockGetCookie.mockReturnValue(null);
  });

  it('redirects to /Dashboard when accessToken is in localStorage', () => {
    localStorage.setItem('accessToken', 'fake-token');
    const { getByTestId } = render(
      <MemoryRouter><RootRedirect /></MemoryRouter>
    );
    expect(getByTestId('navigate')).toHaveAttribute('data-to', '/Dashboard');
    expect(getByTestId('navigate')).toHaveAttribute('data-replace', 'true');
  });

  it('redirects to /Dashboard when accessToken is in sessionStorage', () => {
    sessionStorage.setItem('accessToken', 'fake-token');
    const { getByTestId } = render(
      <MemoryRouter><RootRedirect /></MemoryRouter>
    );
    expect(getByTestId('navigate')).toHaveAttribute('data-to', '/Dashboard');
    expect(getByTestId('navigate')).toHaveAttribute('data-replace', 'true');
  });

  it('redirects to /Dashboard when accessToken is in a cookie', () => {
    mockGetCookie.mockImplementation((key) => key === 'accessToken' ? 'fake-cookie-token' : null);
    const { getByTestId } = render(
      <MemoryRouter><RootRedirect /></MemoryRouter>
    );
    expect(getByTestId('navigate')).toHaveAttribute('data-to', '/Dashboard');
    expect(getByTestId('navigate')).toHaveAttribute('data-replace', 'true');
  });

  it('redirects to /login when no accessToken is present', () => {
    const { getByTestId } = render(
      <MemoryRouter><RootRedirect /></MemoryRouter>
    );
    expect(getByTestId('navigate')).toHaveAttribute('data-to', '/login');
    expect(getByTestId('navigate')).toHaveAttribute('data-replace', 'true');
  });
});
