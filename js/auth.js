export function localProfile(displayName, avatar = '') {
  const name = String(displayName || '').trim(); if (!name) throw new Error('Please enter a display name.');
  return { id: `local-${crypto.randomUUID()}`, displayName: name.slice(0, 40), avatar, provider: 'local', createdAt: new Date().toISOString() };
}
export function firebaseAvailable() { return Boolean(window.TASKORBIT_FIREBASE_CONFIG?.apiKey && window.TASKORBIT_FIREBASE_CONFIG?.authDomain); }
export async function signInWithGoogle() {
  if (!firebaseAvailable()) throw new Error('Google sign-in is not configured. See README.md for setup.');
  const [{ initializeApp }, { getAuth, GoogleAuthProvider, signInWithPopup }] = await Promise.all([import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'), import('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js')]);
  const app = initializeApp(window.TASKORBIT_FIREBASE_CONFIG), result = await signInWithPopup(getAuth(app), new GoogleAuthProvider());
  return { id: result.user.uid, displayName: result.user.displayName || 'Traveler', avatar: result.user.photoURL || '', provider: 'google', createdAt: new Date().toISOString() };
}
