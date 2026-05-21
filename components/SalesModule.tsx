import React, { useState } from 'react';
import { 
  ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, RefreshCw, 
  FileText, Printer, Search, History, Euro, Coins, ScanBarcode, Keyboard, Tag, Package, X, RotateCcw
} from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_EXCHANGE_RATES, MOCK_SALES_HISTORY } from '../services/mockData';
import { Product, CartItem, ExchangeRate } from '../types';
import { useTranslation } from '../i18n';

const SalesModule: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'POS' | 'HISTORY'>('POS');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [rates, setRates] = useState<ExchangeRate[]>(MOCK_EXCHANGE_RATES);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
  // -- Universal Sales State --
  const [searchQuery, setSearchQuery] = useState('');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customItem, setCustomItem] = useState({ name: '', price: '', tax: 0.23 });

  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [docType, setDocType] = useState<'RECEIPT' | 'INVOICE'>('RECEIPT');
  const [paymentCurrency, setPaymentCurrency] = useState<'PLN' | 'EUR' | 'SEK'>('PLN');
  
  // -- Calculations --
  const subtotal = cart.reduce((acc, item) => acc + (item.pricePln * item.quantity), 0);
  const tax = subtotal * 0.15; // Simplified avg tax for demo
  const total = subtotal;

  const getPriceInCurrency = (pricePln: number, currency: string) => {
    if (currency === 'PLN') return pricePln;
    const rate = rates.find(r => r.currency === currency)?.rate || 1;
    return pricePln / rate;
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const addCustomItem = () => {
    const price = parseFloat(customItem.price.replace(',', '.'));
    if (!customItem.name || isNaN(price) || price <= 0) return;

    const newItem: Product = {
        id: `CUSTOM-${Date.now()}`,
        name: customItem.name,
        category: 'SERVICES',
        pricePln: price,
        taxRate: customItem.tax
    };
    addToCart(newItem);
    setIsCustomModalOpen(false);
    setCustomItem({ name: '', price: '', tax: 0.23 });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    alert(`${t('sales.checkout.confirm_btn')}: ${docType === 'INVOICE' ? t('sales.checkout.invoice') : t('sales.checkout.receipt')}. Kwota: ${getPriceInCurrency(total, paymentCurrency).toFixed(2)} ${paymentCurrency}`);
    setCart([]);
    setIsCheckoutOpen(false);
  };

  const refreshRates = () => {
    setRates(prev => prev.map(r => ({ ...r, rate: r.rate + (Math.random() * 0.02 - 0.01) })));
  };

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-slate-100">
      {/* Exchange Rates Bar */}
      <div className="bg-slate-900 text-white p-3 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-6 text-sm">
          <span className="font-bold text-slate-400">{t('sales.rates.title')}</span>
          {rates.map(r => (
             <div key={r.currency} className="flex items-center gap-2">
               <span className="bg-slate-700 px-2 py-0.5 rounded text-xs">{r.currency}</span>
               <span className="font-mono text-emerald-400">{r.rate.toFixed(4)} PLN</span>
             </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
           <button onClick={refreshRates} className="flex items-center gap-1 text-xs hover:text-blue-300 transition">
             <RefreshCw size={14} /> {t('sales.rates.update')}
           </button>
           <div className="h-4 w-px bg-slate-700"></div>
           <div className="flex gap-2">
             <button 
                onClick={() => setActiveTab('POS')}
                className={`px-3 py-1 rounded text-sm font-medium transition ${activeTab === 'POS' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'}`}
             >
               {t('sales.tab.pos')}
             </button>
             <button 
                onClick={() => setActiveTab('HISTORY')}
                className={`px-3 py-1 rounded text-sm font-medium transition ${activeTab === 'HISTORY' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800'}`}
             >
               {t('sales.tab.history')}
             </button>
           </div>
        </div>
      </div>

      {activeTab === 'POS' ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Main POS Interface (Left) */}
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* STICKY HEADER: Search & Categories */}
            <div className="bg-white border-b border-slate-200 p-6 space-y-4 shadow-sm z-20">
               <div className="flex gap-4">
                  <div className="flex-1 relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                     <input 
                        type="text" 
                        placeholder={t('sales.pos.search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-blue-500 font-medium bg-slate-50 transition-all focus:bg-white"
                     />
                  </div>
                  <div className="relative w-64 hidden md:block">
                     <ScanBarcode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                     <input 
                        type="text" 
                        placeholder={t('sales.pos.barcode_placeholder')}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-emerald-500 font-mono text-sm bg-slate-50 transition-all focus:bg-white"
                     />
                  </div>
               </div>

               <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {['ALL', 'TICKETS', 'FOOD', 'SHOP', 'SERVICES'].map(cat => (
                     <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${
                           selectedCategory === cat 
                              ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                              : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                     >
                        {cat === 'ALL' ? t('common.all') : t(`sales.cat.${cat.toLowerCase()}` as any)}
                     </button>
                  ))}
               </div>
            </div>

            {/* SCROLLABLE GRID: Products */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
               <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pb-20">
                  <button 
                     onClick={() => setIsCustomModalOpen(true)}
                     className="bg-blue-50 p-4 rounded-xl border-2 border-dashed border-blue-200 hover:bg-blue-100 hover:border-blue-500 transition-all text-left flex flex-col justify-center items-center h-36 group shadow-sm"
                  >
                     <div className="bg-blue-200 p-3 rounded-full text-blue-700 mb-2 group-hover:scale-110 transition-transform">
                        <Keyboard size={24} />
                     </div>
                     <h4 className="font-black text-blue-900 text-center text-xs uppercase tracking-tight">{t('sales.pos.quick_sale')}</h4>
                     <p className="text-[10px] text-blue-600 text-center font-bold">{t('sales.pos.manual_entry')}</p>
                  </button>

                  {filteredProducts.map(product => (
                    <button 
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all text-left group flex flex-col justify-between h-36 relative overflow-hidden shadow-sm"
                    >
                       <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                          {product.category === 'TICKETS' && <Tag size={48} />}
                          {product.category === 'FOOD' && <Package size={48} />}
                          {product.category === 'SHOP' && <ShoppingCart size={48} />}
                       </div>
                       <div>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{t(`sales.cat.${product.category.toLowerCase()}` as any)}</span>
                         <h4 className="font-bold text-slate-800 text-sm leading-tight mt-1 group-hover:text-blue-600 pr-4">{product.name}</h4>
                       </div>
                       <div className="flex justify-between items-end">
                          <div className="font-mono text-lg font-black text-emerald-600">
                            {product.pricePln.toFixed(2)} <span className="text-xs">PLN</span>
                          </div>
                          <div className="bg-slate-100 p-1.5 rounded-lg text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                             <Plus size={16} />
                          </div>
                       </div>
                    </button>
                  ))}
               </div>
               {filteredProducts.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                     <Package size={64} className="opacity-20 mb-4" />
                     <p className="font-black uppercase tracking-widest text-sm">Brak pasujących produktów</p>
                  </div>
               )}
            </div>
          </div>

          {/* Cart Sidebar (Right) */}
          <div className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-2xl z-30">
             <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center h-16">
               <h3 className="font-black text-slate-700 flex items-center gap-2 text-xs uppercase tracking-widest">
                 <ShoppingCart size={18} className="text-blue-600"/> {t('sales.cart.title')}
               </h3>
               <button onClick={() => setCart([])} className="text-[10px] text-red-500 hover:text-red-700 font-black uppercase tracking-widest flex items-center gap-1">
                 <Trash2 size={12} /> {t('sales.cart.clear')}
               </button>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/20">
               {cart.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-3 opacity-50">
                    <div className="bg-slate-100 p-6 rounded-full"><ShoppingCart size={48} /></div>
                    <p className="font-bold text-sm uppercase tracking-tighter">{t('sales.cart.empty')}</p>
                 </div>
               ) : (
                 cart.map(item => (
                   <div key={item.id} className="flex flex-col bg-white p-3 rounded-xl border border-slate-100 shadow-sm animate-in slide-in-from-right-2">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-slate-800 text-sm leading-tight pr-4">{item.name}</div>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500">
                           <X size={16} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                         <div className="text-xs font-mono font-bold text-emerald-600">
                           {item.pricePln.toFixed(2)} <span className="text-[10px]">PLN</span>
                         </div>
                         <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                           <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition font-bold text-slate-500">-</button>
                           <span className="text-xs font-black w-8 text-center text-slate-700">{item.quantity}</span>
                           <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition font-bold text-slate-500">+</button>
                         </div>
                      </div>
                   </div>
                 ))
               )}
             </div>

             <div className="p-6 bg-white border-t border-slate-200 shadow-inner">
               <div className="space-y-2 mb-6">
                 <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                   <span>{t('sales.cart.net')}</span>
                   <span className="font-mono">{(total - tax).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                   <span>{t('sales.cart.tax')}</span>
                   <span className="font-mono">{tax.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-end pt-3 border-t border-slate-100">
                   <span className="font-black text-slate-800 uppercase text-xs tracking-widest">{t('sales.cart.total')}</span>
                   <span className="text-3xl font-black text-blue-600 tracking-tighter leading-none">{total.toFixed(2)} <span className="text-xs">PLN</span></span>
                 </div>
               </div>
               
               <button 
                 onClick={() => setIsCheckoutOpen(true)}
                 disabled={cart.length === 0}
                 className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed flex justify-center items-center gap-3 transition-all active:scale-95"
               >
                 <CreditCard size={18} /> {t('sales.cart.checkout_btn')}
               </button>
             </div>
          </div>
        </div>
      ) : (
        <div className="p-8 max-w-6xl mx-auto w-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">{t('sales.history.title')}</h2>
            <div className="flex gap-2">
               <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-slate-50 font-bold text-sm">
                  <Printer size={16} /> {t('sales.history.print_daily')}
               </button>
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                 <input type="text" placeholder={t('sales.history.search_placeholder')} className="pl-10 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
               </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
                <tr>
                   <th className="p-4">{t('sales.history.col_id')}</th>
                   <th className="p-4">{t('sales.history.col_type')}</th>
                   <th className="p-4">{t('sales.history.col_date')}</th>
                   <th className="p-4">{t('sales.history.col_client')}</th>
                   <th className="p-4 text-right">{t('sales.history.col_amount')}</th>
                   <th className="p-4 text-center">{t('sales.history.col_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                 {MOCK_SALES_HISTORY.map(doc => (
                   <tr key={doc.id} className="hover:bg-slate-50 transition">
                     <td className="p-4 font-mono font-black text-slate-700">{doc.id}</td>
                     <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${doc.type === 'INVOICE' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {doc.type === 'INVOICE' ? t('sales.checkout.invoice') : t('sales.checkout.receipt')}
                        </span>
                     </td>
                     <td className="p-4 text-slate-600">{doc.date}</td>
                     <td className="p-4 text-slate-600 font-medium">{doc.clientName || '-'}</td>
                     <td className="p-4 text-right font-black text-slate-800">{doc.totalPln.toFixed(2)}</td>
                     <td className="p-4 flex justify-center gap-2">
                        <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition" title={t('sales.history.duplicate')}>
                          <Printer size={16}/>
                        </button>
                        <button className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition" title={t('sales.history.adjustment')}>
                          <RotateCcw size={16}/>
                        </button>
                     </td>
                   </tr>
                 ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Custom Item Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{t('sales.custom.title')}</h3>
              <button onClick={() => setIsCustomModalOpen(false)} className="text-slate-400 hover:text-red-500 transition">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-6">
               <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{t('sales.custom.name')}</label>
                  <input 
                    type="text" 
                    value={customItem.name}
                    onChange={e => setCustomItem({...customItem, name: e.target.value})}
                    placeholder={t('sales.custom.placeholder')}
                    className="w-full border-2 border-slate-100 p-3 rounded-xl outline-none focus:border-blue-500 bg-slate-50 font-bold"
                    autoFocus
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{t('sales.custom.price')}</label>
                    <input 
                      type="number" 
                      value={customItem.price}
                      onChange={e => setCustomItem({...customItem, price: e.target.value})}
                      placeholder="0.00"
                      className="w-full border-2 border-slate-100 p-3 rounded-xl outline-none focus:border-blue-500 bg-slate-50 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{t('sales.custom.tax')}</label>
                    <select 
                      value={customItem.tax}
                      onChange={e => setCustomItem({...customItem, tax: parseFloat(e.target.value)})}
                      className="w-full border-2 border-slate-100 p-3 rounded-xl outline-none focus:border-blue-500 bg-slate-50 font-bold appearance-none cursor-pointer"
                    >
                      <option value="0.23">23% VAT</option>
                      <option value="0.08">8% VAT</option>
                      <option value="0.05">5% VAT</option>
                      <option value="0">0% / Zw.</option>
                    </select>
                  </div>
               </div>
               <button 
                 onClick={addCustomItem}
                 className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 mt-4 shadow-xl shadow-blue-100 transition-all active:scale-95"
               >
                 {t('sales.custom.add_btn')}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                 <h2 className="text-xl font-black flex items-center gap-3 uppercase tracking-tight">
                   <CreditCard className="text-blue-400"/> {t('sales.checkout.title')}
                 </h2>
                 <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-white transition">
                   <X size={24} />
                 </button>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div>
                       <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t('sales.checkout.doc_type')}</label>
                       <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => setDocType('RECEIPT')}
                            className={`p-4 rounded-xl border-2 font-black uppercase text-[10px] tracking-widest flex flex-col items-center justify-center gap-2 transition-all ${docType === 'RECEIPT' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-white hover:border-slate-200'}`}
                          >
                            <FileText size={24}/> {t('sales.checkout.receipt')}
                          </button>
                          <button 
                            onClick={() => setDocType('INVOICE')}
                            className={`p-4 rounded-xl border-2 font-black uppercase text-[10px] tracking-widest flex flex-col items-center justify-center gap-2 transition-all ${docType === 'INVOICE' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-white hover:border-slate-200'}`}
                          >
                            <FileText size={24}/> {t('sales.checkout.invoice')}
                          </button>
                       </div>
                    </div>

                    {docType === 'INVOICE' && (
                       <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border-2 border-slate-100 animate-in slide-in-from-top-2 shadow-inner">
                          <input type="text" placeholder={t('sales.checkout.tax_id')} className="w-full p-2.5 border-2 border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500 font-bold" />
                          <input type="text" placeholder={t('sales.checkout.company_name')} className="w-full p-2.5 border-2 border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500 font-bold" />
                          <input type="text" placeholder={t('sales.checkout.address')} className="w-full p-2.5 border-2 border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500 font-bold" />
                       </div>
                    )}
                 </div>

                 <div className="space-y-6">
                    <div>
                       <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t('sales.checkout.currency')}</label>
                       <div className="space-y-2">
                          {['PLN', 'EUR', 'SEK'].map(curr => {
                            const amount = getPriceInCurrency(total, curr);
                            return (
                              <button 
                                key={curr}
                                onClick={() => setPaymentCurrency(curr as any)}
                                className={`w-full flex justify-between items-center p-4 rounded-xl border-2 transition-all ${
                                  paymentCurrency === curr ? 'border-emerald-500 bg-emerald-50 shadow-md ring-1 ring-emerald-500' : 'border-slate-100 bg-slate-50 hover:bg-white'
                                }`}
                              >
                                <span className="font-black text-slate-700 flex items-center gap-3">
                                  {curr === 'EUR' ? <Euro size={20} className="text-blue-500"/> : curr === 'SEK' ? <Coins size={20} className="text-amber-500"/> : <Banknote size={20} className="text-emerald-500"/>}
                                  {curr}
                                </span>
                                <span className="font-mono font-black text-lg">
                                  {amount.toFixed(2)}
                                </span>
                              </button>
                            )
                          })}
                       </div>
                       <p className="text-[10px] text-slate-400 mt-4 text-center font-bold italic">
                         {t('sales.checkout.rate_info', { info: paymentCurrency !== 'PLN' ? `1 ${paymentCurrency} = ${rates.find(r => r.currency === paymentCurrency)?.rate.toFixed(4)} PLN` : t('sales.checkout.base_rate') })}
                       </p>
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center md:text-left space-y-1">
                    <p className="flex items-center gap-2 justify-center md:justify-start"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {t('sales.checkout.methods')}</p>
                    <p className="flex items-center gap-2 justify-center md:justify-start"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> {t('sales.checkout.fiscal_status')}</p>
                 </div>
                 <button 
                    onClick={handleCheckout}
                    className="w-full md:w-auto bg-emerald-600 text-white py-4 px-12 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-3"
                 >
                    <Printer size={20}/> {t('sales.checkout.confirm_btn')}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SalesModule;