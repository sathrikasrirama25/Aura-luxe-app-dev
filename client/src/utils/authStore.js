// Pre-seeded verified luxury members
const SEEDED_ACCOUNTS = [
  {
    id: 'usr_alex_default',
    name: 'Alex Mercer',
    email: 'alex.mercer.luxe@gmail.com',
    password: 'Alex@123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    provider: 'Email & Password',
    tier: 'VIP Gold Member',
    points: 4850,
    ordersCount: 5,
    savedAddress: {
      name: 'Alex Mercer',
      doorNo: 'Villa 7, Palm Meadows',
      street: 'Whitefield Main Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560066',
      mobile: '+91 99001 88776'
    }
  },
  {
    id: 'usr_sathrika_default',
    name: 'Sathrika Srirama',
    email: 'sathrikasrirama25@users.noreply.github.com',
    password: 'Sathrika@123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    provider: 'GitHub Verified',
    tier: 'VIP Gold Connoisseur',
    points: 3600,
    ordersCount: 4,
    savedAddress: {
      name: 'Sathrika Srirama',
      doorNo: 'Penthouse 12B',
      street: 'Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560038',
      mobile: '+91 98450 12345'
    }
  }
];

const STORAGE_KEY = 'auraluxe_registered_users';

/**
 * Retrieve all registered users from localStorage merged with seeded accounts.
 */
export function getRegisteredUsers() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const customUsers = stored ? JSON.parse(stored) : [];
    
    // Merge: custom users take precedence over seeded accounts with the same email
    const allUsers = [...SEEDED_ACCOUNTS];
    customUsers.forEach((custom) => {
      const idx = allUsers.findIndex(
        (u) => u.email.toLowerCase() === custom.email.toLowerCase()
      );
      if (idx > -1) {
        allUsers[idx] = custom;
      } else {
        allUsers.push(custom);
      }
    });

    return allUsers;
  } catch (e) {
    return SEEDED_ACCOUNTS;
  }
}

/**
 * Authenticate a user by email & password.
 * Strictly verifies the account is already signed up / registered.
 */
export function authenticateUser({ email, password }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (!cleanEmail) {
    throw new Error('Please enter your registered email address.');
  }
  if (!cleanPassword) {
    throw new Error('Please enter your account password.');
  }

  const users = getRegisteredUsers();
  const matchedUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!matchedUser) {
    throw new Error(
      'Account not found. This email is not registered yet. Please click "Create Account / Sign Up" to register.'
    );
  }

  if (matchedUser.password && matchedUser.password !== cleanPassword) {
    throw new Error('Incorrect password. Please verify your password and try again.');
  }

  // Return safe profile copy (do not leak password in session state)
  const safeProfile = { ...matchedUser };
  delete safeProfile.password;
  return safeProfile;
}

/**
 * Register a new user into the persistent database.
 */
export function registerUser({ name, email, password }) {
  const cleanName = (name || '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (!cleanName || cleanName.length < 2) {
    throw new Error('Please enter your full name (at least 2 characters).');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  if (!cleanPassword || cleanPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const users = getRegisteredUsers();
  const alreadyExists = users.some((u) => u.email.toLowerCase() === cleanEmail);

  if (alreadyExists) {
    throw new Error(
      'An account with this email is already registered. Please switch to "Sign In" to access your account.'
    );
  }

  const newUser = {
    id: `usr_reg_${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    password: cleanPassword,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
    provider: 'Aura Luxe Member',
    tier: 'VIP Gold Member',
    points: 500, // 500 welcome bonus points
    ordersCount: 0,
    savedAddress: null,
    registeredAt: new Date().toISOString()
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const customUsers = stored ? JSON.parse(stored) : [];
    customUsers.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customUsers));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }

  const safeProfile = { ...newUser };
  delete safeProfile.password;
  return safeProfile;
}

/**
 * Check if an email is registered.
 */
export function isEmailRegistered(email) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const users = getRegisteredUsers();
  return users.some((u) => u.email.toLowerCase() === cleanEmail);
}
