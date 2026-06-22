import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import ThankYou from './pages/ThankYou';
import OurStory from './pages/OurStory';
import Admin from './pages/Admin';
import Care from './pages/Care';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ParallaxBackground from './components/ParallaxBackground';
import { isFirebaseConfigured, auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export type Page = 'home' | 'shop' | 'product' | 'checkout' | 'thankyou' | 'story' | 'admin' | 'care';

const VALID_PAGES: Page[] = ['home', 'shop', 'product', 'checkout', 'thankyou', 'story', 'admin', 'care'];

function pathToPage(pathname: string): Page {
  const segment = pathname.replace(/^\//, '').split('/')[0] as Page;
  return VALID_PAGES.includes(segment) ? segment : 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => pathToPage(window.location.pathname));
  const [currentData, setCurrentData] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Sync URL -> state on browser back/forward
  useEffect(() => {
    const onPop = () => setCurrentPage(pathToPage(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Listen to Firebase auth state globally
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setAuthLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      if (firebaseUser && db) {
        // Save / update user profile in Firestore on every login
        const userRef = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          // First time - create profile
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
            createdAt: Date.now(),
          });
        } else {
          // Refresh name/photo in case they changed
          await setDoc(userRef, {
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
          }, { merge: true });
        }
      }
    });
    return () => unsub();
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: 24 }}>
        <div style={{ maxWidth: 520, background: 'white', borderRadius: 28, padding: 40, border: '2px dashed #ba1a1a', textAlign: 'center', boxShadow: 'var(--shadow-lift)' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: 16 }}>🔧</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#ba1a1a', marginBottom: 12 }}>Firebase Setup Required</h1>
          <p style={{ color: 'var(--color-ink-muted)', marginBottom: 24, lineHeight: 1.7 }}>
            Firebase is not configured. To fix this, follow these steps:
          </p>
          <ol style={{ textAlign: 'left', color: 'var(--color-ink-muted)', paddingLeft: 20, marginBottom: 24, lineHeight: 2 }}>
            <li>Create a <code style={{ background: 'var(--color-bg-warm)', padding: '2px 8px', borderRadius: 6, fontSize: '0.85rem' }}>.env</code> file in the project root.</li>
            <li>Copy from <code style={{ background: 'var(--color-bg-warm)', padding: '2px 8px', borderRadius: 6, fontSize: '0.85rem' }}>.env.example</code> and fill in Firebase credentials.</li>
            <li>Restart the dev server.</li>
          </ol>
          <div style={{ background: '#ffdad6', color: '#93000a', padding: '14px 20px', borderRadius: 14, fontSize: '0.9rem', fontWeight: 600 }}>
            App cannot start until environment variables are provided.
          </div>
        </div>
      </div>
    );
  }

  const navigate = (page: Page, data?: any) => {
    setCurrentPage(page);
    setCurrentData(data || null);
    const path = page === 'home' ? '/' : `/${page}`;
    window.history.pushState({ page }, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showNav = ['home', 'shop', 'product', 'story', 'care'].includes(currentPage);
  const showFooter = ['home', 'shop', 'product', 'story', 'care'].includes(currentPage);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', width: '100%', overflowX: 'hidden' }}>
      <ParallaxBackground />

      {showNav && <Navigation currentPage={currentPage} onNavigate={navigate} user={user} />}

      <main key={currentPage} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {currentPage === 'home' && <Home onNavigate={navigate} />}
        {currentPage === 'shop' && <Shop onNavigate={navigate} />}
        {currentPage === 'product' && <ProductDetail onNavigate={navigate} data={currentData} />}
        {currentPage === 'checkout' && <Checkout onNavigate={navigate} data={currentData} user={user} authLoading={authLoading} />}
        {currentPage === 'thankyou' && <ThankYou onNavigate={navigate} />}
        {currentPage === 'story' && <OurStory onNavigate={navigate} />}
        {currentPage === 'care' && <Care onNavigate={navigate} />}
        {currentPage === 'admin' && <Admin onNavigate={navigate} user={user} authLoading={authLoading} />}
      </main>

      {showFooter && <Footer onNavigate={navigate} />}
    </div>
  );
}
