
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Home from '../app/(tabs)/home';
import { useRouter } from 'expo-router';
import { useGetBankAccount, useGetUserID } from '@/hooks/useGetFirestoreData';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/useGetFirestoreData', () => ({
  useGetUserID: jest.fn(),
  useGetBankAccount: jest.fn(),
}));

jest.mock('@/components/AppHeader', () => 'AppHeader');
jest.mock('@/components/HorizontalLine', () => 'HorizontalLine');

jest.mock('@/assets/images/card.png', () => 'card.png');

describe('Home Screen', () => {
  const mockNavigate = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      push: mockPush,
    });

    (useGetUserID as jest.Mock).mockReturnValue({
      data: 'user123',
      isLoading: false,
      isError: false,
    });

    (useGetBankAccount as jest.Mock).mockReturnValue({
      data: {
        balance: 1000,
      },
      isLoading: false,
      isError: false,
    });
  });

  test('renders the card image', () => {
    const { getByTestId } = render(<Home />);
    const cardImage = getByTestId('card-image');
    expect(cardImage).toBeTruthy();
    expect(cardImage.props.source).toEqual('card.png');
  });

  test('displays the account balance', () => {
    const { getByText } = render(<Home />);
    expect(getByText('1000,-')).toBeTruthy();
  });

  test('calls handleTransactions when "Mine Transaksjoner" button is pressed', () => {
    const { getByText } = render(<Home />);
    const transactionsButton = getByText('Mine Transaksjoner');
    fireEvent.press(transactionsButton);
    expect(mockPush).toHaveBeenCalledWith('/Transactions');
  });

  test('calls handleLastMonth when left arrow is pressed', () => {
    console.log = jest.fn(); // Mock console.log
    const { getByTestId } = render(<Home />);
    const leftArrow = getByTestId('left-arrow');
    fireEvent.press(leftArrow);
    expect(console.log).toHaveBeenCalledWith('Last month');
  });

  test('calls handleNextMonth when right arrow is pressed', () => {
    console.log = jest.fn(); 
    const { getByTestId } = render(<Home />);
    const rightArrow = getByTestId('right-arrow');
    fireEvent.press(rightArrow);
    expect(console.log).toHaveBeenCalledWith('Next month');
  });

  test('renders budget posts with correct amounts', () => {
    const { getByText } = render(<Home />);
    expect(getByText('Mottatt')).toBeTruthy();
    expect(getByText('500,00 kr')).toBeTruthy();
    expect(getByText('Brukt')).toBeTruthy();
    expect(getByText('200,00 kr')).toBeTruthy();
    expect(getByText('Total')).toBeTruthy();
    expect(getByText('+ 300,00 kr')).toBeTruthy();
  });

  test('matches the snapshot', () => {
    const tree = render(<Home />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('handles missing account data gracefully', () => {
    (useGetBankAccount as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });
    const { queryByText } = render(<Home />);
    expect(queryByText('1000,-')).toBeNull();
  });
});
