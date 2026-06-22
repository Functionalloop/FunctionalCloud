import {
  ArrowLeft, ArrowRight, CreditCard, Heart, Lock, LogIn,
  Mail, ShoppingBasket, Truck, User, Wallet
} from "lucide-react";
import { PageProps, Product } from "../types";
import { useState, useEffect } from "react";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth, googleProvider } from "../firebase";
import { signInWithPopup, signOut, User as FirebaseUser } from "firebase/auth";

interface CheckoutProps extends PageProps {
  user: FirebaseUser | null;
  authLoading: boolean;
}

export default function Checkout({ onNavigate, data, user, authLoading }: CheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [formData, setFormData] = useState({
    whatsapp: '',
    firstName: '',
    lastName: '',
    address: '',
    extraDescription: '',
    city: '',
    state: '',
    zip: ''
  });
  const [paymentProofBase64, setPaymentProofBase64] = useState<string | null>(null);

  const product: Product | null = data;
  const subtotal = product ? product.price : 0;
  const total = subtotal;

  // Pre-fill name from Google profile & load saved address from Firestore
  useEffect(() => {
    if (!user) return;
    const nameParts = (user.displayName || '').split(' ');
    setFormData(prev => ({
      ...prev,
      firstName: prev.firstName || nameParts[0] || '',
      lastName: prev.lastName || nameParts.slice(1).join(' ') || '',
    }));
    // Load saved shipping info
    if (db) {
      getDoc(doc(db, 'users', user.uid)).then(snap => {
        if (snap.exists()) {
          const d = snap.data();
          if (d.savedAddress) {
            setFormData(prev => ({
              ...prev,
              whatsapp: d.savedAddress.whatsapp || prev.whatsapp,
              address: d.savedAddress.address || prev.address,
              extraDescription: d.savedAddress.extraDescription || prev.extraDescription,
              city: d.savedAddress.city || prev.city,
              state: d.savedAddress.state || prev.state,
              zip: d.savedAddress.zip || prev.zip,
            }));
          }
        }
      });
    }
  }, [user]);

  const handleGoogleSignIn = async () => {
    if (!auth || !googleProvider) return;
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        alert('Sign-in failed. Please try again.');
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress heavily to ensure it fits in Firestore 1MB limit
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          resolve(dataUrl);
        };
        img.onerror = (e) => reject(e);
      };
      reader.onerror = (e) => reject(e);
    });
  };

  const handleFileChange = async (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await compressImage(file);
        setPaymentProofBase64(base64);
      } catch (err) {
        alert("Failed to process image.");
      }
    }
  };

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.items) {
        for (const item of e.clipboardData.items) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              try {
                const base64 = await compressImage(file);
                setPaymentProofBase64(base64);
              } catch (err) {
                alert("Failed to process image.");
              }
            }
          }
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const handlePlaceOrder = async () => {
    if (!user) { handleGoogleSignIn(); return; }
    if (!formData.whatsapp || !formData.firstName || !formData.address) {
      alert("Please fill out the required shipping and contact details.");
      return;
    }
    if (!paymentProofBase64) {
      alert("Please provide a screenshot of your Google Pay payment.");
      return;
    }

    setLoading(true);
    try {
      // Save order directly with the base64 image
      const order = {
        userId: user.uid,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerWhatsapp: formData.whatsapp,
        customerEmail: user.email || '',
        address: formData.address,
        extraDescription: formData.extraDescription,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        total,
        items: product ? [{ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl }] : [],
        status: 'pending',
        paymentProofUrl: paymentProofBase64,
        createdAt: Date.now(),
      };
      await addDoc(collection(db, 'orders'), order);

      // Save address to user profile for next time
      await setDoc(doc(db, 'users', user.uid), {
        savedAddress: {
          whatsapp: formData.whatsapp,
          address: formData.address,
          extraDescription: formData.extraDescription,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        }
      }, { merge: true });

      onNavigate('thankyou');
    } catch (err: any) {
      console.error(err);
      alert(`Failed to place order.\n\nError: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // ── Auth Loading ──
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-on-surface-variant font-label-md">Loading...</p>
        </div>
      </div>
    );
  }

  // ── Google Sign-In Gate ──
  if (!user) {
    return (
      <>
        <header className="w-full py-6 px-gutter bg-surface/90 backdrop-blur-md border-b-2 border-dashed border-outline-variant sticky top-0 z-50">
          <div className="max-w-container-max mx-auto flex justify-center items-center relative">
            <button onClick={() => onNavigate('shop')} className="absolute left-0 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5"/>
              <span className="hidden sm:inline font-label-md text-label-md">Return to Shop</span>
            </button>
            <div className="font-display text-headline-md text-primary flex items-center gap-2">
              <Heart className="w-6 h-6 fill-primary" /> Cloud Bloom
            </div>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center px-gutter py-16">
          <div className="max-w-md w-full bg-surface-container-lowest rounded-[2.5rem] p-8 md:p-12 border-2 border-dashed border-outline-variant shadow-[0_20px_60px_rgba(74,63,53,0.10)] text-center">
            {/* User icon */}
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 ring-4 ring-primary/20">
              <User className="w-10 h-10 text-primary" />
            </div>

            <h1 className="font-display text-headline-lg text-on-surface mb-3">Sign in to Checkout</h1>
            <p className="text-on-surface-variant mb-8 leading-relaxed">
              We use Google Sign-In to keep your order safe and to remember your shipping details for next time.
            </p>

            {/* Product preview */}
            {product && (
              <div className="flex items-center gap-4 bg-surface-container rounded-2xl p-4 mb-8 text-left border border-dashed border-outline-variant">
                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-outline-variant/30" />
                <div className="flex-grow">
                  <p className="font-label-md text-on-surface">{product.name}</p>
                  <p className="text-sm text-on-surface-variant">{product.category}</p>
                </div>
                <p className="font-bold text-primary text-lg">₹{product.price.toFixed(2)}</p>
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="w-full flex items-center justify-center gap-3 bg-on-surface text-surface py-4 rounded-2xl font-label-md text-base hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 shadow-lg disabled:opacity-60"
            >
              {/* Google G logo */}
              <svg viewBox="0 0 48 48" className="w-5 h-5 flex-shrink-0">
                <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.5 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.4 7.1 28.9 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
                <path fill="#FF3D00" d="m6.3 15.5 6.6 4.8C14.6 17.1 19 14 24 14c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.4 7.1 28.9 5 24 5c-7.7 0-14.4 4.4-17.7 10.5z"/>
                <path fill="#4CAF50" d="M24 45c4.8 0 9.2-1.8 12.5-4.8l-5.8-4.9C28.9 36.7 26.6 37.5 24 37.5c-5.2 0-9.5-3.4-11.1-8.2l-6.5 5C9.5 40.5 16.2 45 24 45z"/>
                <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l5.8 4.9C36.9 38.9 44 33.5 44 25c0-1.3-.1-2.6-.4-3.9z"/>
              </svg>
              {signingIn ? 'Signing in...' : 'Continue with Google'}
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-on-surface-variant text-sm opacity-70">
              <Lock className="w-4 h-4"/> Your details are encrypted and secure
            </div>
          </div>
        </main>
      </>
    );
  }

  // ── Checkout Form (authenticated) ──
  return (
    <>
      <header className="w-full py-6 px-gutter bg-surface/90 backdrop-blur-md border-b-2 border-dashed border-outline-variant sticky top-0 z-50">
        <div className="max-w-container-max mx-auto flex justify-between items-center">
          <button onClick={() => onNavigate('shop')} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5"/>
            <span className="hidden sm:inline font-label-md text-label-md">Return to Shop</span>
          </button>
          <div className="font-display text-headline-md text-primary flex items-center gap-2">
            <Heart className="w-6 h-6 fill-primary" /> Cloud Bloom
          </div>
          {/* Signed-in user chip */}
          <div className="flex items-center gap-2 bg-surface-container rounded-full px-3 py-1.5 border border-dashed border-outline-variant">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-primary" />
              </div>
            )}
            <span className="text-xs font-label-md text-on-surface hidden sm:inline">{user.displayName?.split(' ')[0]}</span>
            <button
              onClick={() => signOut(auth)}
              className="text-xs text-on-surface-variant hover:text-error transition-colors ml-1"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-gutter py-12 md:py-16">
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-2">Secure Checkout</h1>
          <p className="text-on-surface-variant">Almost yours! Just a few final stitches to complete your order.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 flex flex-col gap-8">

            {/* Contact Info */}
            <section className="bg-surface-container-lowest rounded-[2rem] p-6 md:p-8 shadow-[0px_10px_30px_rgba(74,63,53,0.04)] border-2 border-dashed border-surface-variant relative overflow-hidden">
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-dashed border-outline-variant rounded-tl-xl opacity-50"></div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2 flex items-center gap-3">
                <Mail className="text-tertiary w-6 h-6"/> Contact Details
              </h2>
              {/* Google account badge */}
              <div className="flex items-center gap-2 mb-6 bg-primary/5 rounded-xl px-4 py-2 border border-dashed border-primary/20">
                {user.photoURL && <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full object-cover"/>}
                <div>
                  <p className="text-xs font-label-md text-on-surface">{user.displayName}</p>
                  <p className="text-xs text-on-surface-variant">{user.email}</p>
                </div>
                <LogIn className="w-4 h-4 text-primary ml-auto" />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-2 ml-4">WhatsApp Number</label>
                  <input name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} type="tel" placeholder="+91 98765 43210" className="w-full bg-surface-container-low border-2 border-dashed border-outline-variant rounded-2xl px-6 py-4 text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:border-solid focus:ring-0 transition-all shadow-sm" required/>
                </div>
              </div>
            </section>

            {/* Shipping Info */}
            <section className="bg-surface-container-lowest rounded-[2rem] p-6 md:p-8 shadow-[0px_10px_30px_rgba(74,63,53,0.04)] border-2 border-dashed border-surface-variant relative overflow-hidden">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-3">
                <Truck className="text-tertiary w-6 h-6"/> Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-2 ml-4">First Name</label>
                  <input name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" placeholder="Priya" className="w-full bg-surface-container-low border-2 border-dashed border-outline-variant rounded-2xl px-6 py-4 text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:border-solid transition-all shadow-sm" required/>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-2 ml-4">Last Name</label>
                  <input name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" placeholder="Sharma" className="w-full bg-surface-container-low border-2 border-dashed border-outline-variant rounded-2xl px-6 py-4 text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:border-solid transition-all shadow-sm"/>
                </div>
                <div className="md:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-2 ml-4">Address</label>
                  <input name="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="123 MG Road" className="w-full bg-surface-container-low border-2 border-dashed border-outline-variant rounded-2xl px-6 py-4 text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:border-solid transition-all shadow-sm" required/>
                </div>
                <div className="md:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-2 ml-4">Extra Description (Landmark, etc.)</label>
                  <input name="extraDescription" value={formData.extraDescription} onChange={handleInputChange} type="text" placeholder="Near Reliance Fresh, 2nd Floor" className="w-full bg-surface-container-low border-2 border-dashed border-outline-variant rounded-2xl px-6 py-4 text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:border-solid transition-all shadow-sm"/>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-2 ml-4">City</label>
                  <input name="city" value={formData.city} onChange={handleInputChange} type="text" placeholder="Mumbai" className="w-full bg-surface-container-low border-2 border-dashed border-outline-variant rounded-2xl px-6 py-4 text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:border-solid transition-all shadow-sm"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2 ml-4">State/UT</label>
                    <input name="state" value={formData.state} onChange={handleInputChange} type="text" placeholder="MH" className="w-full bg-surface-container-low border-2 border-dashed border-outline-variant rounded-2xl px-6 py-4 text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:border-solid transition-all shadow-sm"/>
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2 ml-4">PIN Code</label>
                    <input name="zip" value={formData.zip} onChange={handleInputChange} type="text" placeholder="400001" className="w-full bg-surface-container-low border-2 border-dashed border-outline-variant rounded-2xl px-6 py-4 text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:border-solid transition-all shadow-sm"/>
                  </div>
                </div>
              </div>
            </section>

            {/* Google Pay Section */}
            <section className="bg-surface-container-lowest rounded-[2rem] p-6 md:p-8 shadow-[0px_10px_30px_rgba(74,63,53,0.04)] border-2 border-dashed border-surface-variant relative overflow-hidden">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-3">
                <Wallet className="text-tertiary w-6 h-6"/> Google Pay
              </h2>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="bg-surface-container p-4 rounded-2xl border-2 border-dashed border-outline-variant w-full md:w-auto flex-shrink-0 flex flex-col items-center justify-center">
                  <div className="w-40 h-40 bg-surface rounded-xl flex items-center justify-center border border-outline-variant/30 relative overflow-hidden">
                    <img src="https://lh3.googleusercontent.com/aida-public/AOUr-Yv2wBIt19W4q9b1y95X644S0YlA-67n2g_m8EaQ1_45L8nO1T411_oO5-0V5R01n04_Z5G02hO6h21E1O6yZ8h0L90A61S0q7t41Q" alt="QR Code" className="w-full h-full object-cover" />
                  </div>
                  <p className="mt-4 text-sm font-label-md text-on-surface text-center">Scan to Pay</p>
                  <p className="text-xs text-on-surface-variant">Amount: ₹{total.toFixed(2)}</p>
                </div>

                <div className="flex-grow w-full space-y-4">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Upload Payment Screenshot</label>
                    <p className="text-sm text-on-surface-variant mb-4">Browse for a file or paste directly (Ctrl+V / Cmd+V).</p>

                    <div className="relative w-full bg-surface-container-low border-2 border-dashed border-outline-variant rounded-2xl p-6 text-center hover:bg-surface-container-lowest transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {paymentProofBase64 ? (
                        <div className="flex flex-col items-center">
                          <div className="w-32 h-32 rounded-xl overflow-hidden mb-3 border border-outline-variant">
                            <img src={paymentProofBase64} alt="Payment Proof" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-primary font-label-md text-sm cursor-pointer hover:underline">Change image</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-6">
                          <CreditCard className="w-8 h-8 text-outline mb-2" />
                          <span className="text-on-surface font-label-md mb-1">Click to browse or paste image</span>
                          <span className="text-xs text-on-surface-variant">Supports JPG, PNG</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24">
              <div className="bg-surface-container-lowest rounded-[2.5rem] p-6 md:p-8 shadow-[0px_10px_30px_rgba(74,63,53,0.08)] border border-dashed border-secondary relative overflow-hidden">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                  <ShoppingBasket className="text-primary w-6 h-6 fill-primary/20"/> Your Basket
                </h2>

                <div className="space-y-6 mb-8">
                  {product ? (
                    <div className="flex gap-4 items-center group">
                      <div className="w-20 h-20 rounded-[1.2rem] overflow-hidden bg-surface-container flex-shrink-0 border border-outline-variant/30 group-hover:scale-105 transition-transform duration-300 relative">
                        <img className="w-full h-full object-cover" src={product.imageUrl} alt={product.name}/>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-label-md text-label-md text-on-surface">{product.name}</h3>
                        <p className="text-sm text-on-surface-variant mt-1">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-label-md text-label-md text-on-surface">₹{product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-on-surface-variant">Your cart is empty.</p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="w-full border-t border-dashed border-outline-variant/50 my-4"></div>
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="font-headline-md text-headline-md text-on-surface">Total</span>
                      <p className="text-xs text-on-surface-variant">Including ₹0.00 in taxes</p>
                    </div>
                    <span className="font-headline-md text-headline-md text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || !product}
                  className="w-full bg-primary text-on-primary rounded-[2rem] py-5 font-label-md text-lg hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 shadow-[0_8px_16px_-4px_rgba(149,72,36,0.3)] hover:shadow-[0_12px_24px_-4px_rgba(149,72,36,0.4)] flex justify-center items-center gap-2 group disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? "Processing..." : "Place Order"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-on-surface-variant text-sm opacity-80">
                  <Lock className="w-4 h-4"/> Secure, encrypted checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full mt-section-gap py-8 px-gutter border-t-2 border-dashed border-outline-variant bg-surface-container-low">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-sm text-on-surface-variant">
          <p>© 2024 Cloud Bloom. Developed by Functional Enterprises.</p>
          <div className="flex gap-6">
            <button className="hover:text-primary transition-colors text-on-surface-variant">Privacy Policy</button>
            <button className="hover:text-primary transition-colors text-on-surface-variant">Terms of Service</button>
            <button className="hover:text-primary transition-colors text-on-surface-variant">Contact Support</button>
          </div>
        </div>
      </footer>
    </>
  );
}
