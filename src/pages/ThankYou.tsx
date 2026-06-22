import { Droplets, Heart, Download } from "lucide-react";
import { PageProps } from "../types";
import Footer from "../components/Footer";
import { generateInvoice } from "../utils/pdfGenerator";

export default function ThankYou({ onNavigate, data }: PageProps) {
  const orderId: string | null = (data as any)?.orderId ?? null;
  const orderData: any = (data as any)?.order ?? null;

  // Dynamic delivery estimate: +5 to +8 days from today
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  const from = new Date(); from.setDate(from.getDate() + 5);
  const to   = new Date(); to.setDate(to.getDate() + 8);
  const deliveryRange = `${fmt(from)} – ${fmt(to)}`;

  return (
    <div className="flex-grow flex flex-col items-center pt-20">
      <main className="px-margin-mobile md:px-gutter max-w-container-max mx-auto w-full py-12 flex flex-col items-center flex-grow">
        {/* Hero Confirmation Section */}
        <section className="w-full max-w-2xl bg-surface-container-low rounded-xl plush-shadow dashed-border-stitch p-8 md:p-12 text-center relative overflow-hidden mb-section-gap mt-10">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-tertiary opacity-10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary opacity-10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-surface border-dashed">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDe5zs3J15vZZd_NyucjrKj3TiWaWlehwbUb1_DLL1lW0Jjibj79BDMydrqlLzleERSxhF0sKHG4ck6ZBb55CYhuk9ihtU70C9Dk5P7TAMs5J-La7MX2GWyPdj0euMkBVdFrzvPCKDVgv7jPGzOFyvbHFnv_4c3R64w56lKGms608hgCy_e93YwQi3R6-n0S-Cvd0dQJZKscbtRMPwG11WX4yscTxszWqRK_sYMw2dOKvDsojz0kZPCQ_adP2w6s_Ls3gqG8WTIdM"
                alt="Thank You"
                loading="lazy"
                decoding="async"
              />
            </div>
            
            <h1 className="font-display text-display text-primary mb-4">Thank You!</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-md mx-auto">
              Your Cloud Bloom order is confirmed. We're getting your yarn and hooks ready for their journey to you!
            </p>
            
            <div className="bg-surface rounded-lg p-6 w-full max-w-sm mx-auto mb-8 dashed-border-stitch">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-dashed border-outline-variant">
                <span className="font-label-md text-label-md text-on-surface-variant">Order ID</span>
                <span className="font-body-md text-body-md font-bold text-on-background font-mono text-sm">
                  {orderId ? `#${orderId.slice(0, 8).toUpperCase()}` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label-md text-label-md text-on-surface-variant">Est. Delivery</span>
                <span className="font-body-md text-body-md font-bold text-primary">{deliveryRange}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => onNavigate('shop')}
                className="bg-primary hover:bg-primary/90 text-on-primary font-label-md text-label-md py-4 px-8 rounded-full transition-transform hover:scale-105 active:scale-95 plush-shadow"
              >
                Back to Shop
              </button>
              
              {orderData && orderId && (
                <button 
                  onClick={() => generateInvoice(orderData, orderId)}
                  className="bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md py-4 px-8 rounded-full transition-all hover:scale-105 active:scale-95 border-2 border-dashed border-primary/30 flex items-center gap-2"
                >
                  <Download size={18} />
                  Download Invoice
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Care Tips */}
        <section className="w-full max-w-4xl mb-section-gap">
          <h2 className="font-headline-md text-headline-md text-center text-secondary mb-8">A Little TLC for Your Wonders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-lg p-6 plush-shadow dashed-border-stitch flex items-start gap-4">
              <div className="bg-secondary-container text-on-secondary-container p-3 rounded-full flex-shrink-0">
                <Droplets className="fill-current w-6 h-6"/>
              </div>
              <div>
                <h3 className="font-headline-md text-body-lg font-bold text-secondary mb-2">Hand Wash Only</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Treat your handmade items gently. Use lukewarm water and mild soap. Never wring or twist.</p>
              </div>
            </div>
            
            <div className="bg-surface rounded-lg p-6 plush-shadow dashed-border-stitch flex items-start gap-4">
              <div className="bg-tertiary-container text-on-tertiary-container p-3 rounded-full flex-shrink-0">
                <Heart className="fill-current w-6 h-6"/>
              </div>
              <div>
                <h3 className="font-headline-md text-body-lg font-bold text-tertiary mb-2">Love Frequently</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">These items are made to be squeezed, hugged, and enjoyed. The more love, the softer they get.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
