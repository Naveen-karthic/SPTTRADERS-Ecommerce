import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  MessageCircle,
  Search,
  Loader2,
  X,
  Package,
  IndianRupee,
  MapPin,
  FileCheck,
  Receipt,
  FileCode,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import {
  getAllProducts,
  createBill,
  getAllBills,
  deleteBill,
} from '../services/adminService';

interface Product {
  _id: string;
  productName: string;
  itemCode: string;
  price: number;
  type?: 'unit' | 'weight';
}

interface BillItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  type?: 'unit' | 'weight';
}

interface Bill {
  _id: string;
  billNumber: string;
  billType: string;
  customerName: string;
  phoneNumber: string;
  customerAddress?: string;
  customerGSTIN?: string;
  items: BillItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  totalAmount: number;
  createdAt: string;
}

type BillType = 'tax' | 'simple' | 'purchase' | 'estimate';

const Billing: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerGSTIN, setCustomerGSTIN] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<BillItem[]>([]);
  const [billType, setBillType] = useState<BillType>('tax');
  const [gstRate, setGstRate] = useState(18);

  const [currentBill, setCurrentBill] = useState<Bill | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchBills();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data.products || []);
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
    }
  };

  const fetchBills = async () => {
    try {
      const data = await getAllBills();
      setBills(data.bills || []);
    } catch (err: any) {
      console.error('Failed to fetch bills:', err);
    }
  };

  const addProductToBill = (product: Product) => {
    const existingItem = selectedProducts.find(
      (item) => item.productId === product._id
    );

    if (existingItem) {
      setSelectedProducts(
        selectedProducts.map((item) =>
          item.productId === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.price,
              }
            : item
        )
      );
    } else {
      setSelectedProducts([
        ...selectedProducts,
        {
          productId: product._id,
          productName: product.productName,
          quantity: 1,
          price: product.price,
          subtotal: product.price,
          type: product.type || 'unit',
        },
      ]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 0) return;

    setSelectedProducts(
      selectedProducts.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.price,
            }
          : item
      )
    );
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(
      selectedProducts.filter((item) => item.productId !== productId)
    );
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.productName.toLowerCase().includes(searchLower) ||
      product.itemCode.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getSubtotal = () => {
    return selectedProducts.reduce((total, item) => total + item.subtotal, 0);
  };

  const getGST = () => {
    if (billType !== 'tax') return { cgst: 0, sgst: 0, totalGST: 0 };
    const subtotal = getSubtotal();
    const totalGST = (subtotal * gstRate) / 100;
    return {
      cgst: totalGST / 2,
      sgst: totalGST / 2,
      totalGST,
    };
  };

  const getTotalAmount = () => {
    const subtotal = getSubtotal();
    const { totalGST } = getGST();
    return subtotal + totalGST;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateGSTIN = (gstin: string): boolean => {
    // Basic GSTIN validation (15 characters, starts with digit)
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return !gstin || gstinRegex.test(gstin);
  };

  const handleCreateBill = async () => {
    if (!customerName || !phoneNumber || selectedProducts.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in customer name, phone number, and add at least one product',
      });
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Phone Number',
        text: 'Please enter a valid 10-digit Indian mobile number (starting with 6-9)',
      });
      return;
    }

    if (billType === 'tax' && customerGSTIN && !validateGSTIN(customerGSTIN)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid GSTIN',
        text: 'Please enter a valid GSTIN number',
      });
      return;
    }

    try {
      setIsLoading(true);
      const billData = {
        customerName,
        phoneNumber,
        customerAddress,
        customerGSTIN,
        items: selectedProducts.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        billType,
        gstRate,
      };

      const response = await createBill(billData);
      const createdBill = response.bill;

      await Swal.fire({
        icon: 'success',
        title: 'Bill Created!',
        text: `${getBillTypeLabel(billType)} ${createdBill.billNumber} created successfully`,
        timer: 2000,
        showConfirmButton: false,
      });

      setCurrentBill(createdBill);
      setShowPreview(true);
      setShowCreateForm(false);
      resetForm();
      await fetchBills();
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || err.message || 'Failed to create bill',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCustomerName('');
    setPhoneNumber('');
    setCustomerAddress('');
    setCustomerGSTIN('');
    setSelectedProducts([]);
    setBillType('tax');
    setGstRate(18);
    setCurrentBill(null);
    setShowPreview(false);
  };

  const getBillTypeLabel = (type: BillType): string => {
    const labels = {
      tax: 'Tax Invoice',
      simple: 'Simple Invoice',
      purchase: 'Purchase Bill',
      estimate: 'Estimate',
    };
    return labels[type] || 'Bill';
  };

  const getBillTypeIcon = (type: BillType) => {
    const icons = {
      tax: FileCheck,
      simple: Receipt,
      purchase: Package,
      estimate: FileCode,
    };
    return icons[type] || FileText;
  };

  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero';

    const convertLessThanThousand = (n: number): string => {
      if (n === 0) return '';
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
      return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
    };

    const convert = (n: number): string => {
      if (n === 0) return '';
      if (n < 1000) return convertLessThanThousand(n);
      if (n < 100000) return convertLessThanThousand(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convertLessThanThousand(n % 1000) : '');
      if (n < 10000000) return convertLessThanThousand(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '');
      return convertLessThanThousand(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : '');
    };

    const rounded = Math.round(num);
    const amount = convert(rounded);
    return amount + ' Rupees Only';
  };

  const handleSendWhatsApp = (bill: Bill) => {
    const { cgst, sgst } = getGST();

    let message = `*SPT TRADERS - ${getBillTypeLabel(bill.billType as BillType).toUpperCase()}*\n\n`;
    message += `*Bill No:* ${bill.billNumber}\n`;
    message += `*Customer:* ${bill.customerName}\n`;
    if (bill.customerAddress) message += `*Address:* ${bill.customerAddress}\n`;
    message += `*Phone:* ${bill.phoneNumber}\n`;
    message += `*Date:* ${new Date(bill.createdAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })}\n\n`;

    if (bill.billType === 'tax' && bill.customerGSTIN) {
      message += `*GSTIN:* ${bill.customerGSTIN}\n`;
    }

    message += `*Items:*\n`;
    message += `─────────────────\n`;

    bill.items.forEach((item, index) => {
      message += `${index + 1}. ${item.productName}\n`;
      message += `   Qty: ${item.quantity} × ₹${item.price} = ₹${item.subtotal}\n`;
    });

    message += `─────────────────\n`;
    message += `*Subtotal:* ₹${bill.subtotal.toFixed(2)}\n`;

    if (bill.billType === 'tax') {
      message += `*CGST:* ₹${bill.cgst.toFixed(2)}\n`;
      message += `*SGST:* ₹${bill.sgst.toFixed(2)}\n`;
    }

    message += `*Total: ₹${bill.totalAmount.toFixed(2)}*\n\n`;
    message += `*Amount in Words:*\n${numberToWords(bill.totalAmount)}\n\n`;
    message += `Thank you for shopping with us! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    let cleanPhone = bill.phoneNumber.replace(/\D/g, '');
    if (cleanPhone.startsWith('91')) {
      cleanPhone = cleanPhone.substring(2);
    }

    const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePrintBill = (bill: Bill) => {
    setCurrentBill(bill);
    setShowPreview(true);

    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleDeleteBill = async (billId: string, billNumber: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete bill ${billNumber}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!result.isConfirmed) return;

    try {
      await deleteBill(billId);
      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Bill deleted successfully',
        timer: 2000,
        showConfirmButton: false,
      });
      await fetchBills();
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || err.message || 'Failed to delete bill',
      });
    }
  };

  const filteredBills = bills.filter(
    (bill) =>
      bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.phoneNumber.includes(searchTerm)
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-primary tracking-tight">Billing Management</h2>
          <p className="text-text-muted font-medium">Create and manage invoices with multiple bill types</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateForm(true);
          }}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center space-x-3 shadow-xl shadow-primary/20 hover:bg-primary-light transition-all active:scale-95 text-xs uppercase tracking-widest border-2 border-primary/10"
        >
          <Plus className="w-5 h-5 text-accent" />
          <span>Create Bill</span>
        </button>
      </div>

      {/* Create Bill Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="premium-card p-8 border-2 border-accent/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-primary">Create New Bill</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bill Type Selection */}
                <div className="lg:col-span-3 space-y-6">
                  <h4 className="text-lg font-bold text-primary">Bill Type</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(['tax', 'simple', 'purchase', 'estimate'] as BillType[]).map((type) => {
                      const Icon = getBillTypeIcon(type);
                      return (
                        <button
                          key={type}
                          onClick={() => setBillType(type)}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center space-y-2 ${
                            billType === type
                              ? 'border-accent bg-accent/10 shadow-lg'
                              : 'border-border/50 hover:border-accent/50'
                          }`}
                        >
                          <Icon className={`w-6 h-6 ${billType === type ? 'text-accent' : 'text-text-muted'}`} />
                          <span className="text-sm font-black text-primary">{getBillTypeLabel(type)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-primary">Customer Details</h4>

                  <div>
                    <label className="block text-sm font-black text-primary mb-2">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                      className="w-full px-4 py-3 border border-border/50 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-primary mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 9876543210"
                      maxLength={10}
                      className="w-full px-4 py-3 border border-border/50 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all font-bold"
                    />
                    <p className="text-xs text-text-muted mt-1">
                      10-digit mobile number (starting with 6-9)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-primary mb-2">
                      Address
                    </label>
                    <textarea
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Customer address"
                      rows={2}
                      className="w-full px-4 py-3 border border-border/50 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all font-bold resize-none"
                    />
                  </div>

                  {billType === 'tax' && (
                    <div>
                      <label className="block text-sm font-black text-primary mb-2">
                        GSTIN (Optional)
                      </label>
                      <input
                        type="text"
                        value={customerGSTIN}
                        onChange={(e) => setCustomerGSTIN(e.target.value.toUpperCase())}
                        placeholder="e.g. 33ABCDE1234F1Z5"
                        maxLength={15}
                        className="w-full px-4 py-3 border border-border/50 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all font-bold uppercase"
                      />
                    </div>
                  )}
                </div>

                {/* GST Settings (for Tax Invoice) */}
                {billType === 'tax' && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-bold text-primary">GST Settings</h4>

                    <div>
                      <label className="block text-sm font-black text-primary mb-2">
                        GST Rate
                      </label>
                      <select
                        value={gstRate}
                        onChange={(e) => setGstRate(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-border/50 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all font-bold bg-white"
                      >
                        <option value={5}>5%</option>
                        <option value={12}>12%</option>
                        <option value={18}>18%</option>
                        <option value={28}>28%</option>
                      </select>
                    </div>

                    <div className="p-4 bg-accent/10 rounded-xl">
                      <p className="text-sm font-bold text-primary mb-2">GST Summary</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-text-muted">CGST:</span>
                          <span className="font-bold">{gstRate / 2}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">SGST:</span>
                          <span className="font-bold">{gstRate / 2}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Total GST:</span>
                          <span className="font-black text-accent">{gstRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add Products */}
                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-primary">Add Products</h4>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Search products by name or code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Products Count */}
                  <p className="text-sm text-text-muted">
                    Showing {currentProducts.length} of {filteredProducts.length} products
                    {searchTerm && ` (filtered from ${products.length} total)`}
                  </p>

                  {/* Product List */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {currentProducts.map((product) => (
                      <button
                        key={product._id}
                        onClick={() => addProductToBill(product)}
                        className="w-full flex items-center justify-between p-4 border border-border/50 rounded-xl hover:border-accent hover:bg-accent/5 transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <Package className="w-5 h-5 text-accent" />
                          <div className="text-left">
                            <p className="font-bold text-sm text-primary">{product.productName}</p>
                            <p className="text-xs text-text-muted">{product.itemCode}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            product.type === 'weight'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {product.type === 'weight' ? 'KG' : 'PCS'}
                          </span>
                          <div className="flex items-center space-x-1">
                            <IndianRupee className="w-4 h-4 text-text-muted" />
                            <span className="font-black text-primary">{product.price}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                    {filteredProducts.length === 0 && (
                      <p className="text-center text-text-muted py-8">
                        No products found
                      </p>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                        >
                          Previous
                        </button>

                        <div className="flex items-center space-x-2">
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => {
                              // Show first 2 pages, last 2 pages, and pages around current page
                              return page <= 2 || page > totalPages - 2 || Math.abs(page - currentPage) <= 1;
                            })
                            .map((page, idx, arr) => {
                              // Add ellipsis
                              if (idx > 0 && arr[idx - 1] !== page - 1) {
                                return (
                                  <span key={`ellipsis-${page}`} className="px-2 text-text-muted">
                                    ...
                                  </span>
                                );
                              }
                              return (
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  className={`px-3 py-2 rounded-lg transition-colors ${
                                    currentPage === page
                                      ? 'bg-primary text-white'
                                      : 'bg-gray-100 text-text-muted hover:bg-gray-200'
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            })}
                        </div>

                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Selected Products */}
              {selectedProducts.length > 0 && (
                <div className="mt-8 border-t border-border/50 pt-6">
                  <h4 className="text-lg font-bold text-primary mb-4">Selected Items</h4>
                  <div className="space-y-3">
                    {selectedProducts.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex-grow">
                          <p className="font-bold text-primary">{item.productName}</p>
                          <p className="text-sm text-text-muted">
                            ₹{item.price} × {item.quantity} = ₹{item.subtotal}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => {
                              const step = item.type === 'weight' ? 0.25 : 1;
                              updateQuantity(item.productId, Math.max(0, item.quantity - step));
                            }}
                            className="w-8 h-8 bg-white border border-border rounded-lg flex items-center justify-center hover:bg-gray-100"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            step={item.type === 'weight' ? '0.01' : '1'}
                            min="0"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              updateQuantity(item.productId, isNaN(value) ? 0 : value);
                            }}
                            className="w-16 h-8 border border-border rounded-lg text-center font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <button
                            onClick={() => {
                              const step = item.type === 'weight' ? 0.25 : 1;
                              updateQuantity(item.productId, item.quantity + step);
                            }}
                            className="w-8 h-8 bg-white border border-border rounded-lg flex items-center justify-center hover:bg-gray-100"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeProduct(item.productId)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Summary */}
                  <div className="mt-6 space-y-3 p-6 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-black text-primary">Subtotal</span>
                      <span className="text-xl font-bold">₹{getSubtotal().toFixed(2)}</span>
                    </div>

                    {billType === 'tax' && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-text-muted">CGST ({gstRate / 2}%)</span>
                          <span className="text-lg font-bold">₹{getGST().cgst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-text-muted">SGST ({gstRate / 2}%)</span>
                          <span className="text-lg font-bold">₹{getGST().sgst.toFixed(2)}</span>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <span className="text-2xl font-black text-primary">Total Amount</span>
                      <span className="text-3xl font-black text-accent">
                        ₹{getTotalAmount().toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs text-text-muted italic pt-2">
                      {numberToWords(getTotalAmount())}
                    </p>
                  </div>

                  <button
                    onClick={handleCreateBill}
                    disabled={isLoading}
                    className="w-full mt-6 bg-primary text-white px-8 py-4 rounded-xl font-black flex items-center justify-center space-x-3 hover:bg-primary-light transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                    <span>Create {getBillTypeLabel(billType)}</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bills List */}
      <div className="premium-card overflow-hidden">
        <div className="p-8 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-accent/10 rounded-2xl">
              <FileText className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-black text-primary">All Bills</h3>
              <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">
                {bills.length} BILLS GENERATED
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-4.5 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-background border border-border/50 rounded-2xl w-full md:w-64 focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-bold shadow-inner"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                  Bill No
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                  Type
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                  Customer
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                  Phone
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                  Items
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                  Amount
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                  Date
                </th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filteredBills.map((bill) => {
                const BillIcon = getBillTypeIcon(bill.billType as BillType);
                return (
                  <tr key={bill._id} className="group hover:bg-background/20 transition-all">
                    <td className="px-8 py-6">
                      <button
                        onClick={() => navigate(`/admin/billing/${bill._id}`)}
                        className="text-sm font-mono font-bold text-accent hover:underline"
                      >
                        {bill.billNumber}
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2">
                        <BillIcon className="w-4 h-4 text-text-muted" />
                        <span className="text-sm font-bold text-primary">{getBillTypeLabel(bill.billType as BillType)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-primary">{bill.customerName}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-text-muted">{bill.phoneNumber}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-text-muted">
                        {bill.items.length} item{bill.items.length > 1 ? 's' : ''}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-lg font-black text-primary">₹{bill.totalAmount.toFixed(2)}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-text-muted">
                        {new Date(bill.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => handlePrintBill(bill)}
                          className="p-3 glass-premium rounded-xl text-primary hover:text-accent transition-colors shadow-sm"
                          title="Print Bill"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSendWhatsApp(bill)}
                          className="p-3 glass-premium rounded-xl text-green-600 hover:text-green-700 transition-colors shadow-sm"
                          title="Send via WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBill(bill._id, bill.billNumber)}
                          className="p-3 glass-premium rounded-xl text-danger hover:bg-danger/10 transition-colors shadow-sm"
                          title="Delete Bill"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredBills.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-8 py-12 text-center text-text-muted">
                    No bills found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Professional Invoice Print Template */}
      {showPreview && currentBill && (
        <div className="hidden print:block bg-white p-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center border-b-4 border-primary pb-6 mb-8">
            <h1 className="text-4xl font-black text-primary tracking-wider">SPT TRADERS</h1>
            <p className="text-text-muted text-sm mt-1">Wholesale & Retail</p>
            {currentBill.billType === 'tax' && (
              <p className="text-xs font-bold text-accent mt-2">GSTIN: 33ABCDE1234F1Z5</p>
            )}
          </div>

          {/* Bill Type & Number */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-primary uppercase">
              {getBillTypeLabel(currentBill.billType as BillType)}
            </h2>
            <p className="text-xl font-mono font-bold text-accent mt-2">{currentBill.billNumber}</p>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-3">
              <h3 className="text-sm font-black text-primary uppercase tracking-wider border-b border-border pb-2">
                Bill To
              </h3>
              <p className="text-lg font-bold text-primary">{currentBill.customerName}</p>
              {currentBill.customerAddress && (
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-text-muted mt-1 flex-shrink-0" />
                  <p className="text-sm text-text-muted">{currentBill.customerAddress}</p>
                </div>
              )}
              <p className="text-sm text-text-muted">
                <span className="font-bold">Phone:</span> {currentBill.phoneNumber}
              </p>
              {currentBill.billType === 'tax' && currentBill.customerGSTIN && (
                <p className="text-sm text-text-muted">
                  <span className="font-bold">GSTIN:</span> {currentBill.customerGSTIN}
                </p>
              )}
            </div>

            <div className="space-y-3 text-right">
              <h3 className="text-sm font-black text-primary uppercase tracking-wider border-b border-border pb-2">
                Bill Details
              </h3>
              <p className="text-sm text-text-muted">
                <span className="font-bold">Date:</span>{' '}
                {new Date(currentBill.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-primary">
                <th className="text-left py-3 text-sm font-black text-primary w-12">#</th>
                <th className="text-left py-3 text-sm font-black text-primary">Item Description</th>
                <th className="text-center py-3 text-sm font-black text-primary w-20">Qty</th>
                <th className="text-right py-3 text-sm font-black text-primary w-28">Price</th>
                <th className="text-right py-3 text-sm font-black text-primary w-28">Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentBill.items.map((item, index) => (
                <tr key={item.productId} className="border-b border-border">
                  <td className="py-4 text-center text-sm font-bold text-text-muted">{index + 1}</td>
                  <td className="py-4">
                    <p className="font-bold text-primary">{item.productName}</p>
                  </td>
                  <td className="py-4 text-center text-sm">{item.quantity}</td>
                  <td className="py-4 text-right text-sm">₹{item.price.toFixed(2)}</td>
                  <td className="py-4 text-right text-sm font-bold">₹{item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80 space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-bold text-text-muted">Subtotal</span>
                <span className="text-lg font-bold text-primary">₹{currentBill.subtotal.toFixed(2)}</span>
              </div>

              {currentBill.billType === 'tax' && (
                <>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-bold text-text-muted">CGST</span>
                    <span className="text-lg font-bold text-primary">₹{currentBill.cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-bold text-text-muted">SGST</span>
                    <span className="text-lg font-bold text-primary">₹{currentBill.sgst.toFixed(2)}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center py-4 border-t-2 border-primary">
                <span className="text-xl font-black text-primary">Total</span>
                <span className="text-3xl font-black text-accent">₹{currentBill.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="mb-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-bold text-text-muted mb-1">Amount in Words:</p>
            <p className="text-base font-bold text-primary">{numberToWords(currentBill.totalAmount)}</p>
          </div>

          {/* Footer */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-border">
            <div className="text-center">
              <p className="text-sm text-text-muted mb-16">Terms & Conditions</p>
              <p className="text-xs text-text-muted">Goods once sold will not be taken back</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-primary mb-1">For SPT TRADERS</p>
              <p className="text-sm text-text-muted mb-16">Authorized Signatory</p>
              <p className="text-xs text-text-muted">This is a computer generated invoice</p>
            </div>
          </div>

          <div className="text-center mt-8 pt-4 border-t border-border">
            <p className="text-sm text-text-muted">Thank you for your business!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
