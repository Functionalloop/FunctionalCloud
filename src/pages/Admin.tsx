import { useEffect, useState } from 'react';
import { PageProps, Order, Product } from '../types';
import { auth, db } from '../firebase';
import { signInWithPopup, signOut, User } from 'firebase/auth';
import { googleProvider } from '../firebase';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from 'firebase/firestore';
import {
  Package, ShoppingCart, IndianRupee, TrendingUp, Plus, Pencil, Trash2,
  X, Check, LogOut, ArrowLeft, RefreshCw, ChevronDown
} from 'lucide-react';

type Tab = 'overview' | 'products' | 'orders';

const EMPTY_PRODUCT = {
  name: '', price: 0, originalPrice: 0, description: '', category: 'Amigurumi', imageUrl: '',
  isBestseller: false, isNewArrival: false, isLimitedEdition: false,
  features: [] as string[]
};

interface AdminProps extends PageProps {
  user: User | null;
  authLoading: boolean;
}

export default function Admin({ onNavigate, user, authLoading }: AdminProps) {
  const [authError, setAuthError] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [tab, setTab] = useState<Tab>('overview');

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Product form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_PRODUCT });
  const [featureInput, setFeatureInput] = useState('');
  const [saving, setSaving] = useState(false);



  const loadData = async () => {
    setDataLoading(true);
    try {
      const [orderSnap, productSnap] = await Promise.all([
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'products'))
      ]);
      setOrders(orderSnap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      setProducts(productSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    } catch (e) { console.error(e); }
    finally { setDataLoading(false); }
  };

  // Load data whenever user becomes available (covers both first mount and re-login)
  useEffect(() => {
    if (user) loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleGoogleLogin = async () => {
    setAuthError('');
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setAuthError(err.code === 'auth/popup-closed-by-user' ? 'Sign-in cancelled.' : (err.message || 'Google sign-in failed'));
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogout = () => signOut(auth);

  const seedProducts = async () => {
    if (!confirm('This will add 6 default products to Firestore. Continue?')) return;
    const defaultProducts = [
      {
        name: "Tiny Tortoise", price: 1999, description: "Soft and slow, perfect for snuggles.",
        category: "Amigurumi",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxCWYKx2ucQD__wlhmULP6c7ImNGA0ygU45AA7lZgIGmGszoJijRkXTNt9_vbWCXjP_u5D93fHDS4XQrvQcvGiCvOwh-YOJnuXFQIHMjBx2P1MUUfWJDkYt86bE7nMdne3P2yDRpNc_AFu-y9FOA7nOCtJQLE9BucjmY2Prw0mOD89MTJU2qNQH2zay0E83oDQ8cRp4JkLkZlGzbv529QbVz84brE-lQVV9RaZ1fSVqiVA140wc6veEViwHU-tk2n4XCMvGimTupE",
        features: ["100% Organic Cotton Yarn"], isLimitedEdition: true, isNewArrival: false, isBestseller: false
      },
      {
        name: "Blooming Wool Pot", price: 1499, description: "A little greenery that never needs water.",
        category: "Home Decor",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBePCdDU-9x5FbRsEIA-M96loebUzQ6g4jqOTWkfVEHxRCzNnF6OTBw2iBMvLdBgPlujnKVHvnu_lzEntn4lNvBPBgvyTDBJkkAvm5mHAFKp1lB0ZoRGYce7nX3q4k0MTq6c61vQ-vX10Mi3B6wjoNAP_5UUQUYLFSSCYeXYSbgfOuQr_3o72RDQPef325Cuw68-OJ0KdPBYxW7bJofXYXrgHtSkyZtcXzhEAdYi14G4aRDbRqF6yEyiEqEmuj6n1spopr25isSczA",
        features: ["100% Organic Cotton Yarn"], isNewArrival: false, isBestseller: false, isLimitedEdition: false
      },
      {
        name: "Snuggle Teddy", price: 3499, description: "Chunky knit for maximum hugs.",
        category: "Plushies",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcuYSMvYiRQ4VdkgvWy09GbWaLD6x9zf_qKZccIEmz8BsbTBaGXp8Fdr1asm_-3Rbr2Ynqxs2H71BO8_OozrH7i4pUSLuiHJ4J3wJsfXZRfLiNAPOWpKS1_WqepZnc-Ewv2V3aILY8V8HR0kX_c97lhw8yMECMqlGoGqsF-mY34G7uXOwZsTd_jB_xiVMgysLSem3r1tnCZ7eSqqvBHT4o4Lhrn1ZUTf-5OQjKnZAmX5FRBJzD9WcR7jZNC7ksEyfMWI_T4q-Ctbc",
        features: ["100% Organic Cotton Yarn"], isBestseller: true, isNewArrival: false, isLimitedEdition: false
      },
      {
        name: "Buzzy the Bee", price: 1999, description: "A sweet little bee.",
        category: "Amigurumi",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfj6hghoj50ccy6YZntLzivRBOb6CgoBsCvwlxHmiMFU-6ImxeyvLsIJZakx-SCv2mCdsw_IwqwQQlbJrB6Jg1HFaOEPq1Hm28amYNQeT6QpTQBCbi4enA-hEICMQnX961NQlebBDpKRMk7y1AlX5DkKPXjRxKkho4LGvA6o89Lnm630Zcazy2nlSMDuJKNQRcXpA5dfCMsTJZZ9VYfUU9sGmOM9xWb5ULFAYzgMLejI4d3Nvs--WbeRb2OV7gwPzNZKFhxcglWdI",
        features: ["100% Organic Cotton Yarn"], isNewArrival: true, isBestseller: false, isLimitedEdition: false
      },
      {
        name: "Dusty Rose Bunny", price: 2999, description: "Dusty rose bunny for your collection.",
        category: "Amigurumi",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWdSgcoOdDIDO_fHTwClEuOgLxaPx8T4JI1-48SHhP5BNJ3Qmf1hx5OTV2aByFklZeUm4sF7MLY5f_FGIp51GunoxHeQ8a__eTPaxsbg28pTYdOMIv9drDfjPhJreN8x-Pi2H7sjP1GDdM1etYbImtitekFslDEz4VoN_oK1Pdd2HW-MyLOifztx4gKfIbiaZfIMuDBvntM99RES7hiyI_JYFAVHIuXqmJbqiC4HFATKHg5qiP4BuVt_OlQtLo_8T2nMpPh_cdXm0",
        features: ["100% Organic Cotton Yarn"], isNewArrival: false, isBestseller: false, isLimitedEdition: false
      },
      {
        name: "Potted Succulent", price: 1499, description: "Potted succulent, zero maintenance.",
        category: "Home Decor",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9D4GJhknzZiChIeysP3V7HwLWjCgmJUGtRibdUAZCdVWIotG6b2oHWOopoQ0cpRrYra4HOStLa6VmVBw88PkDQugrFp8jyomlNZcgV-tuelvOSaA_lKnv5FDKerDyeHwBMk8VE5FnJXuerYSb9W7N3KV6nwWkCm8JYDAQ1hPKwJqt1x5f4LIGi3s9wzw6FNXCFqvV6SwPTtVZbq2abry8grpZO6T1IvczCUP7oNpFileYDzbkdwCUkHufd0EzTdzOeRbNagbj0rI",
        features: ["100% Organic Cotton Yarn"], isNewArrival: false, isBestseller: false, isLimitedEdition: false
      }
    ];
    try {
      for (const p of defaultProducts) await addDoc(collection(db, 'products'), p);
      alert('6 products seeded successfully!');
      await loadData();
    } catch (e: any) {
      console.error('Seed error:', e);
      alert(`Failed to seed products.\n\nError: ${e?.message || e}\n\nMost likely cause: Firestore Security Rules are blocking writes.\nGo to Firebase Console → Firestore → Rules and allow authenticated writes.`);
    }
  };

  // ── Products ──
  const openNew = () => {
    setEditingId(null);
    setForm({ ...EMPTY_PRODUCT });
    setFeatureInput('');
    setFormOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id!);
    setForm({
      name: p.name, price: p.price,
      originalPrice: p.originalPrice || 0,
      description: p.description,
      category: p.category || 'Amigurumi', imageUrl: p.imageUrl,
      isBestseller: p.isBestseller || false,
      isNewArrival: p.isNewArrival || false,
      isLimitedEdition: p.isLimitedEdition || false,
      features: p.features || []
    });
    setFeatureInput('');
    setFormOpen(true);
  };

  const saveProduct = async () => {
    if (!form.name || !form.imageUrl || form.price <= 0) {
      alert('Please fill in name, image URL, and a valid price.');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), { ...form });
      } else {
        await addDoc(collection(db, 'products'), { ...form });
      }
      setFormOpen(false);
      await loadData();
    } catch (e) { console.error(e); alert('Failed to save product.'); }
    finally { setSaving(false); }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      await loadData();
    } catch (e) { alert('Failed to delete.'); }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setForm(f => ({ ...f, features: [...f.features, featureInput.trim()] }));
      setFeatureInput('');
    }
  };

  const removeFeature = (i: number) =>
    setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

  // ── Orders ──
  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: status as Order['status'] } : o));
    } catch (e) { alert('Failed to update status.'); }
  };

  // ── Stats ──
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  // ─── Auth screen ───
  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      {/* Ambient blobs */}
      <div className="blob-float fixed top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="blob-float-slow fixed bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

      <div className="relative bg-surface-container-lowest plush-shadow-lg rounded-3xl p-10 w-full max-w-sm border-2 border-dashed border-outline-variant page-enter">
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border-2 border-dashed border-primary/20">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-headline-md text-primary">Admin Portal</h1>
          <p className="text-sm text-on-surface-variant mt-1">Cloud Bloom HQ — Staff only</p>
        </div>

        {authError && (
          <div className="bg-error-container text-on-error-container p-3 rounded-xl mb-5 text-sm text-center">{authError}</div>
        )}

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={signingIn}
          className="w-full flex items-center justify-center gap-3 bg-surface border-2 border-outline-variant hover:border-primary hover:bg-surface-container-low py-3.5 rounded-2xl font-label-md text-on-surface transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none plush-shadow"
        >
          {signingIn ? (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {signingIn ? 'Signing in...' : 'Continue with Google'}
        </button>

        <p className="text-xs text-on-surface-variant text-center mt-6">
          Only authorised Google accounts can access this panel.
        </p>

        <button onClick={() => onNavigate('home')} className="mt-4 text-sm text-on-surface-variant hover:text-primary transition-colors w-full text-center flex items-center justify-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
      </div>
    </div>
  );

  // ─── Dashboard ───
  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Header */}
      <header className="bg-surface/90 backdrop-blur-md border-b-2 border-dashed border-outline-variant sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-display text-headline-md text-primary">Cloud Bloom Admin</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">Logged in as {user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadData} className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all" title="Refresh">
              <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => onNavigate('home')} className="text-sm text-on-surface-variant hover:text-primary flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-surface-container transition-all">
              <ArrowLeft className="w-3.5 h-3.5" /> View Site
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-error/10 text-error px-4 py-2 rounded-full text-sm hover:bg-error/20 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-[1400px] mx-auto px-6 flex gap-1 pb-0">
          {(['overview', 'products', 'orders'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-label-md capitalize rounded-t-xl transition-all ${
                tab === t
                  ? 'bg-surface-container-low text-primary border-2 border-b-0 border-dashed border-outline-variant'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container/50'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
              {[
                { label: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: IndianRupee, color: 'text-primary', bg: 'bg-primary/10' },
                { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-secondary', bg: 'bg-secondary/10' },
                { label: 'Products Listed', value: products.length, icon: Package, color: 'text-tertiary', bg: 'bg-tertiary/10' },
                { label: 'Pending Orders', value: pendingCount, icon: TrendingUp, color: 'text-error', bg: 'bg-error/10' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-surface-container-lowest rounded-2xl p-6 border-2 border-dashed border-outline-variant plush-shadow">
                  <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <p className="text-2xl font-display font-bold text-on-surface">{value}</p>
                  <p className="text-sm text-on-surface-variant mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Recent orders preview */}
            <div className="bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant plush-shadow p-6">
              <h2 className="font-display text-headline-md text-on-surface mb-4">Recent Orders</h2>
              {orders.length === 0 ? (
                <p className="text-sm text-on-surface-variant">No orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-dashed border-outline-variant text-left text-on-surface-variant">
                        <th className="pb-3 font-label-md">Order ID</th>
                        <th className="pb-3 font-label-md">Customer</th>
                        <th className="pb-3 font-label-md">Items</th>
                        <th className="pb-3 font-label-md">Total</th>
                        <th className="pb-3 font-label-md">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dashed divide-outline-variant/50">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id} className="hover:bg-surface-container/50 transition-colors">
                          <td className="py-3 font-mono text-xs text-on-surface-variant">#{o.id?.slice(0, 8).toUpperCase()}</td>
                          <td className="py-3 font-medium text-on-surface">{o.customerName || o.customerWhatsapp}</td>
                          <td className="py-3 text-on-surface-variant">{o.items?.map((i: any) => i.name).join(', ') || '—'}</td>
                          <td className="py-3 text-primary font-bold">₹{o.total?.toFixed(2)}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-label-md ${
                              o.status === 'shipped' ? 'bg-secondary/10 text-secondary' :
                              o.status === 'delivered' ? 'bg-primary/10 text-primary' :
                              'bg-error/10 text-error'
                            }`}>{o.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-headline-md text-on-surface">{products.length} Products</h2>
            <div className="flex items-center gap-3">
              <button onClick={seedProducts} className="flex items-center gap-2 bg-tertiary/10 text-tertiary border-2 border-dashed border-tertiary/30 px-4 py-2.5 rounded-full text-sm font-label-md hover:bg-tertiary/20 hover:scale-105 transition-all">
                Seed Dummy Data
              </button>
              <button onClick={openNew} className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full text-sm font-label-md hover:scale-105 transition-transform shadow-md shadow-primary/20">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
              {products.map(p => (
                <div key={p.id} className="bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant plush-shadow overflow-hidden group card-lift">
                  <div className="relative h-44 bg-surface-container">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(p)} className="bg-surface/90 backdrop-blur-sm text-on-surface p-2 rounded-full hover:bg-primary hover:text-on-primary transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteProduct(p.id!)} className="bg-surface/90 backdrop-blur-sm text-error p-2 rounded-full hover:bg-error hover:text-on-error transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-display text-on-surface font-bold">{p.name}</h3>
                      <span className="text-primary font-bold">₹{p.price}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mb-3 line-clamp-2">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full">{p.category}</span>
                      {p.isBestseller && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Bestseller</span>}
                      {p.isNewArrival && <span className="text-xs bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-full">New Arrival</span>}
                      {p.isLimitedEdition && <span className="text-xs bg-error/10 text-error px-2 py-0.5 rounded-full">Limited</span>}
                    </div>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <div className="col-span-3 text-center py-20 text-on-surface-variant">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No products yet. Click "Add Product" to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div className="space-y-6">
            <h2 className="font-display text-headline-md text-on-surface">{orders.length} Orders</h2>
            {orders.length === 0 ? (
              <div className="text-center py-20 text-on-surface-variant">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No orders yet.</p>
              </div>
            ) : (
              <div className="space-y-3 stagger-children">
                {orders.map(o => (
                  <div key={o.id} className="bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant plush-shadow p-5">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-bold text-on-surface">{o.customerName || '—'}</p>
                          <span className="text-xs text-on-surface-variant">{o.customerWhatsapp}</span>
                          <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full ml-auto sm:ml-0">
                            #{o.id?.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-on-surface-variant mb-1">{o.address}, {o.city}, {o.state} {o.zip}</p>
                        {o.extraDescription && (
                          <p className="text-xs text-on-surface-variant mb-1 italic">Note: {o.extraDescription}</p>
                        )}
                        <p className="text-sm text-secondary mb-2">
                          {o.items?.map((i: any) => i.name).join(', ') || '—'}
                        </p>
                        {o.paymentProofUrl && (
                          <a href={o.paymentProofUrl} download="payment_proof.jpg" className="text-xs text-primary hover:underline flex items-center gap-1">
                            <IndianRupee className="w-3 h-3" /> View Payment Proof
                          </a>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <p className="text-lg font-bold text-primary">₹{o.total?.toFixed(2)}</p>
                        <div className="relative">
                          <select
                            value={o.status}
                            onChange={e => updateOrderStatus(o.id!, e.target.value)}
                            className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-label-md cursor-pointer border-2 border-dashed outline-none transition-colors ${
                              o.status === 'shipped' ? 'bg-secondary/10 text-secondary border-secondary/30' :
                              o.status === 'delivered' ? 'bg-primary/10 text-primary border-primary/30' :
                              'bg-error/10 text-error border-error/30'
                            }`}>
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Product Form Modal ── */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-lg border-2 border-dashed border-outline-variant plush-shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b-2 border-dashed border-outline-variant sticky top-0 bg-surface-container-lowest z-10">
              <h2 className="font-display text-headline-md text-on-surface">
                {editingId ? 'Edit Product' : 'New Product'}
              </h2>
              <button onClick={() => setFormOpen(false)} className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Product Name *', key: 'name', type: 'text', placeholder: 'e.g. Cozy Rabbit' },
                { label: 'Image URL *', key: 'imageUrl', type: 'url', placeholder: 'https://...' },
                { label: 'Price (₹) *', key: 'price', type: 'number', placeholder: '1999' },
                { label: 'Original Price (₹) — leave 0 if not on sale', key: 'originalPrice', type: 'number', placeholder: '0' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-label-md text-on-surface-variant mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value }))}
                    className="w-full bg-surface-container-low border-2 border-dashed border-outline-variant rounded-2xl px-4 py-3 focus:border-solid focus:border-secondary outline-none transition-all text-on-surface"
                    placeholder={placeholder}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-label-md text-on-surface-variant mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-surface-container-low border-2 border-dashed border-outline-variant rounded-2xl px-4 py-3 focus:border-solid focus:border-secondary outline-none transition-all text-on-surface resize-none"
                  placeholder="A soft little friend..."
                />
              </div>

              <div>
                <label className="block text-sm font-label-md text-on-surface-variant mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full bg-surface-container-low border-2 border-dashed border-outline-variant rounded-2xl px-4 py-3 focus:border-solid focus:border-secondary outline-none text-on-surface appearance-none"
                >
                  {['Amigurumi', 'Home Decor', 'Plushies', 'Accessories'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-label-md text-on-surface-variant mb-1.5">Features / Materials</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 bg-surface-container-low border-2 border-dashed border-outline-variant rounded-2xl px-4 py-2.5 focus:border-solid focus:border-secondary outline-none text-on-surface text-sm"
                    placeholder="100% Organic Cotton Yarn"
                  />
                  <button onClick={addFeature} className="bg-secondary text-on-secondary px-4 py-2.5 rounded-2xl text-sm hover:scale-105 transition-transform">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.features.map((f, i) => (
                    <span key={i} className="flex items-center gap-1.5 bg-secondary-container text-on-secondary-container text-xs px-3 py-1 rounded-full">
                      {f}
                      <button onClick={() => removeFeature(i)} className="hover:text-error transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'isBestseller', label: 'Bestseller' },
                  { key: 'isNewArrival', label: 'New Arrival' },
                  { key: 'isLimitedEdition', label: 'Limited Ed.' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, [key]: !(f as any)[key] }))}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border-2 border-dashed text-sm font-label-md transition-all ${
                      (form as any)[key]
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-surface-container-low border-outline-variant text-on-surface-variant hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      (form as any)[key] ? 'bg-primary border-primary' : 'border-outline-variant'
                    }`}>
                      {(form as any)[key] && <Check className="w-2.5 h-2.5 text-on-primary" />}
                    </div>
                    {label}
                  </button>
                ))}
              </div>

              {/* Preview */}
              {form.imageUrl && (
                <div className="rounded-2xl overflow-hidden border-2 border-dashed border-outline-variant aspect-video bg-surface-container">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setFormOpen(false)} className="flex-1 py-3 border-2 border-dashed border-outline-variant rounded-full text-on-surface-variant hover:border-error hover:text-error transition-colors text-sm font-label-md">
                Cancel
              </button>
              <button onClick={saveProduct} disabled={saving}
                className="flex-1 py-3 bg-primary text-on-primary rounded-full font-label-md hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-md shadow-primary/20 disabled:opacity-60 disabled:pointer-events-none">
                {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
