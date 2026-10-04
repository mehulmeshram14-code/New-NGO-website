"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import MaharashtraMap from "svgmap-maharashtra";
import { SectionHeading } from "../ui/SectionHeading";

export function VidarbhaMap() {
  return (
    <section className="relative py-24 bg-primary-green text-white overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop"
        alt="Agricultural fields in a rural landscape"
        fill
        className="object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-primary-green/85" />
      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading 
              title="Where we work and where it matters" 
              align="left"
              className="text-white mb-8 [&_h2]:text-white"
            />
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-white/80 text-lg mb-8"
            >
              Our work is deeply connected to the communities we serve. We operate across key districts to ensure support reaches where it is needed most, spreading smiles and hope.
            </motion.p>
            
            <div className="flex flex-wrap gap-3">
              {["Nagpur", "Amravati", "Wardha", "Bhandara"].map((district, i) => (
                <motion.span
                  key={district}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="px-4 py-2 border border-white/30 rounded-full text-sm font-bold tracking-wider text-white hover:bg-white hover:text-primary-green transition-colors cursor-default"
                >
                  {district}
                </motion.span>
              ))}
            </div>
          </div>
          
          <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative mx-auto w-full max-w-[35rem]"
            >
              <style>{`
                .maharashtra-map-container svg {
                  width: 100%;
                  height: auto;
                  filter: drop-shadow(0 4px 20px rgba(0,0,0,0.1));
                }
                .maharashtra-map-container path {
                  transition: all 0.3s ease;
                }
                /* Highlight Vidarbha Region */
                #GAD, #GON, #CHA, #BHA, #NAG, #WAR, #YAV, #AMA, #AKO, #WAS, #BUL {
                  fill: #f59e0b !important; /* Gold/Amber */
                  stroke: #ffffff !important;
                  stroke-width: 3px !important;
                }
                #GAD:hover, #GON:hover, #CHA:hover, #BHA:hover, #NAG:hover, #WAR:hover, #YAV:hover, #AMA:hover, #AKO:hover, #WAS:hover, #BUL:hover {
                  fill: #fbbf24 !important;
                }
              `}</style>
              
              <div className="maharashtra-map-container relative">
                <MaharashtraMap 
                  mapColor="rgba(255, 255, 255, 0.15)"
                  strokeColor="rgba(255, 255, 255, 0.5)"
                  strokeWidth="2"
                  hoverColor="rgba(255, 255, 255, 0.3)"
                  onClick={() => {}}
                />
                
                {/* Overlay Label for Vidarbha */}
                <div className="absolute right-[15%] top-[35%] flex flex-col items-center pointer-events-none">
                  <div className="font-editorial text-2xl font-bold tracking-widest text-white drop-shadow-md">
                    VIDARBHA
                  </div>
                  <div className="text-xs font-semibold tracking-[0.2em] text-white/80 uppercase">
                    Region
                  </div>
                </div>
              </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
