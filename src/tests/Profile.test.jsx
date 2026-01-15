// // // import { render, screen, waitFor } from '@testing-library/react';
// // // import { Provider } from 'react-redux';
// // // import { BrowserRouter } from 'react-router-dom';
// // // import { configureStore } from '@reduxjs/toolkit';
// // // import Profile from '@/pages/Profile';
// // // import authReducer from '@/features/auth/authSlice';
// // // import { vi } from 'vitest';

// // // vi.mock('@/features/auth', async () => {
// // //   const actual = await vi.importActual('@/features/auth');
// // //   return {
// // //     ...actual,
// // //     fetchUserProfile: vi.fn(() => ({ 
// // //       type: 'auth/fetchProfile/fulfilled', 
// // //       payload: { name: 'John Doe', email: 'john@example.com', balance: 5000, mobile: '9999999999', pan: 'ABCDE1234F', createdAt: new Date().toISOString() } 
// // //     })),
// // //   };
// // // });

// // // const renderWithProviders = (ui) => {
// // //   const store = configureStore({
// // //     reducer: { auth: authReducer },
// // //     preloadedState: {
// // //       auth: {
// // //         user: { name: 'John Doe', email: 'john@example.com', mobile: '9999999999', balance: 5000 },
// // //         loading: false
// // //       }
// // //     }
// // //   });
// // //   return render(
// // //     <Provider store={store}>
// // //       <BrowserRouter>{ui}</BrowserRouter>
// // //     </Provider>
// // //   );
// // // };

// // // describe('Profile Page', () => {
// // //   test('renders user profile information', async () => {
// // //     renderWithProviders(<Profile />);
    
// // //     // Wait for the loading skeleton to disappear and content to appear
// // //     await waitFor(() => {
// // //         expect(screen.getByText(/edit profile/i)).toBeInTheDocument();
// // //     });

// // //     expect(screen.getByText(/john doe/i)).toBeInTheDocument();
// // //     expect(screen.getByDisplayValue(/john@example.com/i)).toBeInTheDocument();
// // //   });
// // // });












// // import { render, screen, waitFor } from '@testing-library/react';
// // import { Provider } from 'react-redux';
// // import { BrowserRouter } from 'react-router-dom';
// // import { configureStore } from '@reduxjs/toolkit';
// // import Profile from '@/pages/Profile';
// // import authReducer from '@/features/auth/authSlice';
// // import { vi } from 'vitest';

// // vi.mock('@/features/auth', async () => {
// //   const actual = await vi.importActual('@/features/auth');
// //   return {
// //     ...actual,
// //     fetchUserProfile: vi.fn(() => ({ 
// //       type: 'auth/fetchProfile/fulfilled', 
// //       payload: { name: 'John Doe', email: 'john@example.com', balance: 5000, mobile: '9999999999', pan: 'ABCDE1234F', createdAt: new Date().toISOString() } 
// //     })),
// //   };
// // });

// // const renderWithProviders = (ui) => {
// //   const store = configureStore({
// //     reducer: { auth: authReducer },
// //     preloadedState: {
// //       auth: {
// //         user: { name: 'John Doe', email: 'john@example.com', mobile: '9999999999', balance: 5000 },
// //         loading: false
// //       }
// //     }
// //   });
// //   return render(
// //     <Provider store={store}>
// //       <BrowserRouter>{ui}</BrowserRouter>
// //     </Provider>
// //   );
// // };

// // describe('Profile Page', () => {
// //   test('renders user profile information', async () => {
// //     renderWithProviders(<Profile />);
    
// //     await waitFor(() => {
// //         expect(screen.getByText(/personal information/i)).toBeInTheDocument();
// //     });

// //     // Fix: Target the specific heading to avoid "Multiple elements found" error
// //     expect(screen.getByRole('heading', { name: /john doe/i, level: 1 })).toBeInTheDocument();
// //     expect(screen.getByDisplayValue(/john@example.com/i)).toBeInTheDocument();
// //   });
// // });












// import { render, screen, waitFor } from '@testing-library/react';
// import { Provider } from 'react-redux';
// import { BrowserRouter } from 'react-router-dom';
// import { configureStore } from '@reduxjs/toolkit';
// import Profile from '@/pages/Profile';
// import authReducer from '@/features/auth/authSlice';
// import { vi } from 'vitest';

// vi.mock('@/features/auth', async () => {
//   const actual = await vi.importActual('@/features/auth');
//   return {
//     ...actual,
//     fetchUserProfile: vi.fn(() => ({ 
//       type: 'auth/fetchProfile/fulfilled', 
//       payload: { name: 'John Doe', email: 'john@example.com', balance: 5000, mobile: '9999999999', pan: 'ABCDE1234F', createdAt: new Date().toISOString() } 
//     })),
//   };
// });

// const renderWithProviders = (ui) => {
//   const store = configureStore({
//     reducer: { auth: authReducer },
//     preloadedState: {
//       auth: {
//         user: { name: 'John Doe', email: 'john@example.com', mobile: '9999999999', balance: 5000 },
//         loading: false
//       }
//     }
//   });
//   return render(
//     <Provider store={store}>
//       <BrowserRouter>{ui}</BrowserRouter>
//     </Provider>
//   );
// };

// describe('Profile Page', () => {
//   test('renders user profile information', async () => {
//     renderWithProviders(<Profile />);
    
//     await waitFor(() => {
//         // Specifically look for the Heading to avoid ambiguity
//         expect(screen.getByRole('heading', { name: /personal information/i })).toBeInTheDocument();
//     });

//     expect(screen.getByRole('heading', { name: /john doe/i, level: 1 })).toBeInTheDocument();
//     expect(screen.getByDisplayValue(/john@example.com/i)).toBeInTheDocument();
//   });
// });











import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Profile from '@/pages/Profile';
import authReducer from '@/features/auth/authSlice';
import { vi } from 'vitest';

vi.mock('@/features/auth', async () => {
  const actual = await vi.importActual('@/features/auth');
  return {
    ...actual,
    fetchUserProfile: vi.fn(() => ({ 
      type: 'auth/fetchProfile/fulfilled', 
      payload: { name: 'John Doe', email: 'john@example.com', balance: 5000, mobile: '9999999999', pan: 'ABCDE1234F', createdAt: new Date().toISOString() } 
    })),
  };
});

const renderWithProviders = (ui) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user: { name: 'John Doe', email: 'john@example.com', mobile: '9999999999', balance: 5000 },
        loading: false
      }
    }
  });
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe('Profile Page', () => {
  test('renders user profile information', async () => {
    renderWithProviders(<Profile />);
    
    await waitFor(() => {
        // Wait for the heading to appear (indicates loading is done)
        expect(screen.getByRole('heading', { name: /personal information/i })).toBeInTheDocument();
    });

    // Check for the user's name in the specific Header element
    expect(screen.getByRole('heading', { name: /john doe/i, level: 1 })).toBeInTheDocument();
    
    // ✅ FIX: Use getByText instead of getByDisplayValue because it's rendered as text, not an input
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
  });
});