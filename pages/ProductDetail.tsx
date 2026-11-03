import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { content } = useContent();
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  
  const product = content.products.find(p => p.id === id);

  // 详情文案：后台可编辑，空行分段；没填则不显示该区块（不再显示写死的占位文案）
  const detailBody = isEn ? (product?.detailEn || product?.detail || '') : (product?.detail || '');
  const detailParagraphs = detailBody.split(/\n{2,}/).map(p => p.trim()).filter(p => p.length > 0);
  const materials = isEn ? (product?.materialsEn || product?.materials || '') : (product?.materials || '');
  const dimensions = isEn ? (product?.dimensionsEn || product?.dimensions || '') : (product?.dimensions || '');

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
       {/* 返回按钮：之前这里有一条 fixed 返回条，但被整站页眉（z-50）盖住看不见，
           改为内容区内的返回按钮，点击回首页并滚动到产品区块 */}
       <div className="container mx-auto px-6 md:px-12 pt-28 md:pt-32 pb-24">
          <button
             onClick={() => navigate('/', { state: { scrollTo: 'products' } })}
             className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-stone-900 hover:opacity-60 transition-opacity mb-10"
          >
             <ArrowLeft size={16} /> {isEn ? 'Back to Products' : '返回产品'}
          </button>
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
                   loading="lazy"
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
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-stone-900 mb-8 leading-tight break-words">
                    {isEn ? (product.nameEn || product.name) : product.name}
                </h1>
                <div className="h-[1px] w-20 bg-stone-900 mb-8"></div>
                <p className="text-lg text-stone-600 leading-relaxed mb-10 font-light">
                    {isEn ? (product.descriptionEn || product.description) : product.description}
                </p>
                {detailParagraphs.length > 0 && (
                  <div className="mb-12">
                    {detailParagraphs.map((para, i) => (
                      <p key={i} className="text-sm text-stone-500 leading-relaxed mb-4 font-light whitespace-pre-line">
                        {para}
                      </p>
                    ))}
                  </div>
                )}

                {(materials || dimensions) && (
                  <div className="grid grid-cols-2 gap-8 mb-12">
                    {materials && (
                      <div>
                        <h4 className="text-xs font-bold uppercase mb-2">Materials</h4>
                        <p className="text-sm text-stone-600">{materials}</p>
                      </div>
                    )}
                    {dimensions && (
                      <div>
                        <h4 className="text-xs font-bold uppercase mb-2">Dimensions</h4>
                        <p className="text-sm text-stone-600">{dimensions}</p>
                      </div>
                    )}
                  </div>
                )}

                <button className="w-full md:w-auto px-10 py-4 bg-stone-900 text-white text-sm tracking-widest uppercase hover:bg-stone-700 transition-colors">
                   Inquire Now
                </button>
             </motion.div>
          </div>
       </div>
    </div>
  );
};