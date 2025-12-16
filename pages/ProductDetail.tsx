import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { content } = useContent();
  
  const product = content.products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
           <h2 className="text-2xl font-light mb-4">Product Not Found</h2>
           <Link to="/" className="text-sm border-b border-stone-900 pb-1">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen">
       {/* Nav Strip */}
       <div className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-stone-200 py-4 px-6 md:px-12 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-stone-900 hover:opacity-60 transition-opacity">
             <ArrowLeft size={16} /> Back to Home
          </Link>
          <span className="text-xs font-bold text-stone-400 uppercase">{product.category}</span>
       </div>

       <div className="container mx-auto px-6 md:px-12 pt-32 pb-24">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
             {/* Image */}
             <motion.div 
                {...({
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.8 }
                } as any)}
                className="relative aspect-[4/5] bg-stone-200 overflow-hidden"
             >
                <img 
                   src={product.image} 
                   alt={product.name} 
                   className="w-full h-full object-cover"
                />
             </motion.div>

             {/* Content */}
             <motion.div 
                 {...({
                     initial: { opacity: 0, x: 20 },
                     animate: { opacity: 1, x: 0 },
                     transition: { duration: 0.8, delay: 0.2 }
                 } as any)}
                 className="flex flex-col justify-center"
             >
                <span className="text-xs font-bold text-stone-400 tracking-widest uppercase mb-4 block">
                    Product ID: {product.id}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-stone-900 mb-8 leading-tight">
                    {product.name}
                </h1>
                <div className="h-[1px] w-20 bg-stone-900 mb-8"></div>
                <p className="text-lg text-stone-600 leading-relaxed mb-10 font-light">
                    {product.description}
                </p>
                <p className="text-sm text-stone-500 leading-relaxed mb-12 font-light">
                    这里是详细的产品介绍文案。在后台系统中，您可以添加更多关于该产品的材质、尺寸、工艺细节等信息。
                    Here would be detailed specifications, dimensions, and material information for the product.
                </p>
                
                <div className="grid grid-cols-2 gap-8 mb-12">
                   <div>
                      <h4 className="text-xs font-bold uppercase mb-2">Materials</h4>
                      <p className="text-sm text-stone-600">Oak Wood, Brushed Metal</p>
                   </div>
                   <div>
                      <h4 className="text-xs font-bold uppercase mb-2">Dimensions</h4>
                      <p className="text-sm text-stone-600">H: 220cm / W: 90cm</p>
                   </div>
                </div>

                <button className="w-full md:w-auto px-10 py-4 bg-stone-900 text-white text-sm tracking-widest uppercase hover:bg-stone-700 transition-colors">
                   Inquire Now
                </button>
             </motion.div>
          </div>
       </div>
    </div>
  );
};