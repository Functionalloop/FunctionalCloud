import { Droplets, Heart, Sun, Wind } from "lucide-react";
import { PageProps } from "../types";

export default function Care({ onNavigate }: PageProps) {
  return (
    <div className="max-w-3xl mx-auto px-gutter py-24 md:py-32 flex-grow w-full page-enter">
      <div className="text-center mb-16">
        <h1 className="font-display text-display text-primary mb-4">Care Instructions</h1>
        <p className="font-body-lg text-on-surface-variant max-w-xl mx-auto">
          Your Cloud Bloom companions are handmade with love. Follow these gentle care tips to keep them soft and vibrant for years to come.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Washing */}
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] border-2 border-dashed border-outline-variant shadow-sm hover:scale-[1.02] transition-transform duration-300">
          <Droplets className="w-8 h-8 text-secondary mb-4" />
          <h3 className="font-display text-headline-md text-on-surface mb-3">Washing</h3>
          <p className="font-body-md text-on-surface-variant">
            Spot clean whenever possible using a damp cloth and mild soap. For a full wash, gently hand wash in lukewarm water. Never twist or wring the yarn, as this will distort the shape.
          </p>
        </div>

        {/* Drying */}
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] border-2 border-dashed border-outline-variant shadow-sm hover:scale-[1.02] transition-transform duration-300">
          <Wind className="w-8 h-8 text-secondary mb-4" />
          <h3 className="font-display text-headline-md text-on-surface mb-3">Drying</h3>
          <p className="font-body-md text-on-surface-variant">
            Gently squeeze out excess water (do not wring). Lay flat on a clean, dry towel in its original shape. Do not hang dry, as the weight of the water will stretch the stitches.
          </p>
        </div>

        {/* Sunlight */}
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] border-2 border-dashed border-outline-variant shadow-sm hover:scale-[1.02] transition-transform duration-300">
          <Sun className="w-8 h-8 text-tertiary mb-4" />
          <h3 className="font-display text-headline-md text-on-surface mb-3">Sunlight</h3>
          <p className="font-body-md text-on-surface-variant">
            Keep your amigurumi away from prolonged, direct sunlight. Too much sun can fade the beautiful, vibrant colors of the yarn over time.
          </p>
        </div>

        {/* Love */}
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] border-2 border-dashed border-outline-variant shadow-sm hover:scale-[1.02] transition-transform duration-300">
          <Heart className="w-8 h-8 text-primary mb-4" />
          <h3 className="font-display text-headline-md text-on-surface mb-3">Everyday Love</h3>
          <p className="font-body-md text-on-surface-variant">
            If your plushie gets a little squished during play or travel, simply massage it gently back into its original shape. Loose threads can be tucked back in with a blunt needle.
          </p>
        </div>
      </div>
    </div>
  );
}
