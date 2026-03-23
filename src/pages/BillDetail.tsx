import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  MessageCircle,
  Download,
  FileText,
  MapPin,
  Phone,
  Mail,
  IndianRupee,
  Building2,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { getBillById } from '../services/adminService';
import axios from 'axios';

interface BillItem {
  product: any;
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
  subtotal?: number;
  cgst?: number;
  sgst?: number;
  totalAmount: number;
  createdAt: string;
}

interface BusinessSettings {
  businessName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  logoUrl: string;
}

const BillDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bill, setBill] = useState<Bill | null>(null);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBill();
    fetchBusinessSettings();
  }, [id]);

  const fetchBusinessSettings = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/business-settings`);
      setBusinessSettings(response.data.settings);
    } catch (error) {
      console.error('Error fetching business settings:', error);
      // Set default values if fetch fails
      setBusinessSettings({
        businessName: 'SPT TRADERS',
        tagline: 'Wholesale & Retail',
        address: '123, Main Road, Chennai, Tamil Nadu - 600001',
        phone: '+91 98765 43210',
        email: 'info@spttraders.com',
        gstin: '33ABCDE1234F1Z5',
        logoUrl: ''
      });
    }
  };

  const fetchBill = async () => {
    try {
      setLoading(true);
      const response = await getBillById(id!);
      setBill(response.bill);
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to fetch bill details',
      });
      navigate('/admin/billing');
    } finally {
      setLoading(false);
    }
  };

  const getBillTypeLabel = (type: string): string => {
    const labels: { [key: string]: string } = {
      tax: 'TAX INVOICE',
      simple: 'INVOICE',
      purchase: 'PURCHASE BILL',
      estimate: 'ESTIMATE',
    };
    return labels[type] || 'INVOICE';
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

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    if (!bill || !businessSettings) return;

    let message = `*${businessSettings.businessName} - ${getBillTypeLabel(bill.billType)}*\n\n`;
    message += `*Invoice No:* ${bill.billNumber}\n`;
    message += `*Date:* ${new Date(bill.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}\n\n`;

    message += `*Bill To:*\n`;
    message += `${bill.customerName}\n`;
    if (bill.customerAddress) message += `${bill.customerAddress}\n`;
    message += `Phone: ${bill.phoneNumber}\n`;
    if (bill.customerGSTIN) message += `GSTIN: ${bill.customerGSTIN}\n\n`;

    message += `*Items:*\n`;
    message += `─────────────────\n`;
    bill.items.forEach((item, index) => {
      message += `${index + 1}. ${item.productName}\n`;
      const unit = item.type === 'weight' ? 'kg' : 'pcs';
      message += `   Qty: ${item.quantity} ${unit} × ₹${item.price} = ₹${item.subtotal}\n`;
    });

    message += `─────────────────\n`;
    const subtotal = bill.subtotal || bill.totalAmount;
    message += `*Subtotal:* ₹${subtotal.toFixed(2)}\n`;

    if (bill.billType === 'tax') {
      const cgst = bill.cgst || 0;
      const sgst = bill.sgst || 0;
      message += `*CGST:* ₹${cgst.toFixed(2)}\n`;
      message += `*SGST:* ₹${sgst.toFixed(2)}\n`;
    }

    message += `*Total:* ₹${bill.totalAmount.toFixed(2)}\n\n`;
    message += `*Amount in Words:*\n${numberToWords(bill.totalAmount)}\n\n`;
    message += `Thank you for your business! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    let cleanPhone = bill.phoneNumber.replace(/\D/g, '');
    if (cleanPhone.startsWith('91')) {
      cleanPhone = cleanPhone.substring(2);
    }

    const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-text-muted font-bold">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <p className="text-text-muted font-bold mb-4">Bill not found</p>
          <button
            onClick={() => navigate('/admin/billing')}
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold"
          >
            Back to Bills
          </button>
        </div>
      </div>
    );
  }

  const getGSTPercentage = (): number => {
    if (!bill || !bill.subtotal || bill.subtotal === 0) return 0;
    const cgst = bill.cgst || 0;
    const sgst = bill.sgst || 0;
    const totalGST = cgst + sgst;
    return Math.round((totalGST / bill.subtotal) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Action Bar - Hidden when printing */}
      <div className="bg-white border-b border-gray-200 print:hidden sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/admin/billing')}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">Back to Bills</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-light transition-all font-bold"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-all font-bold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-xl hover:bg-accent/90 transition-all font-bold"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Container - A4 Size */}
      <div className="max-w-4xl mx-auto p-8 print:p-0 print:max-w-none">
        <div className="bg-white shadow-xl print:shadow-none rounded-2xl print:rounded-none overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary to-primary-light p-8 print:p-6 print:bg-white">
            <div className="flex justify-between items-start">
              {/* Company Details */}
              <div className="text-white print:text-primary">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-white p-3 rounded-xl print:bg-accent/10">
                    <FileText className="w-8 h-8 text-primary print:text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black tracking-wider">{businessSettings?.businessName || 'SPT TRADERS'}</h1>
                    <p className="text-sm opacity-90 font-bold">{businessSettings?.tagline || 'Wholesale & Retail'}</p>
                  </div>
                </div>

                <div className="space-y-2 mt-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 opacity-80" />
                    <span>{businessSettings?.address || '123, Main Road, Chennai, Tamil Nadu - 600001'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 opacity-80" />
                    <span>{businessSettings?.phone || '+91 98765 43210'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 opacity-80" />
                    <span>{businessSettings?.email || 'info@spttraders.com'}</span>
                  </div>
                  {bill.billType === 'tax' && (
                    <div className="mt-3 pt-3 border-t border-white/30 print:border-primary/30">
                      <p className="font-bold">GSTIN: {businessSettings?.gstin || '33ABCDE1234F1Z5'}</p>
                      <p className="text-xs opacity-80">(GST Registered)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Invoice Title & Number */}
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm print:bg-accent/10 rounded-2xl p-6 print:p-4">
                  <h2 className="text-4xl font-black text-white print:text-primary mb-2">
                    {getBillTypeLabel(bill.billType)}
                  </h2>
                  <div className="space-y-2 text-white print:text-primary">
                    <p className="text-xl font-mono font-bold">
                      #{bill.billNumber}
                    </p>
                    <div className="text-sm opacity-90 print:opacity-70">
                      <p>Date: {new Date(bill.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details Section */}
          <div className="p-8 print:p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-b-2 border-gray-200 print:border-black">
            {/* Bill To */}
            <div>
              <h3 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Bill To
              </h3>
              <div className="space-y-2">
                <p className="text-xl font-bold text-gray-900">{bill.customerName}</p>
                {bill.customerAddress && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">{bill.customerAddress}</p>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-600">{bill.phoneNumber}</p>
                </div>
                {bill.customerGSTIN && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-xl print:bg-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase">GSTIN</p>
                    <p className="text-lg font-mono font-bold text-gray-900">{bill.customerGSTIN}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Details */}
            <div>
              <h3 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Invoice Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Invoice Type</span>
                  <span className="font-bold text-gray-900">{getBillTypeLabel(bill.billType)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Invoice No.</span>
                  <span className="font-mono font-bold text-gray-900">{bill.billNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Date</span>
                  <span className="font-bold text-gray-900">
                    {new Date(bill.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                {bill.billType === 'tax' && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-500 text-sm">GST Rate</span>
                      <span className="font-bold text-accent">{getGSTPercentage()}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500 text-sm">Place of Supply</span>
                      <span className="font-bold text-gray-900">Tamil Nadu</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="p-8 print:p-6">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-4">
              Items / Services
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 print:bg-gray-100">
                    <th className="text-left py-4 px-4 text-sm font-black text-gray-700 border-b-2 border-gray-300 w-12">
                      #
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-black text-gray-700 border-b-2 border-gray-300">
                      Item Description
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-black text-gray-700 border-b-2 border-gray-300 w-24">
                      HSN/SAC
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-black text-gray-700 border-b-2 border-gray-300 w-20">
                      Qty
                    </th>
                    <th className="text-right py-4 px-4 text-sm font-black text-gray-700 border-b-2 border-gray-300 w-28">
                      Rate
                    </th>
                    {bill.billType === 'tax' && (
                      <th className="text-center py-4 px-4 text-sm font-black text-gray-700 border-b-2 border-gray-300 w-24">
                        GST %
                      </th>
                    )}
                    <th className="text-right py-4 px-4 text-sm font-black text-gray-700 border-b-2 border-gray-300 w-32">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bill.items.map((item, index) => (
                    <tr key={item.product?._id || index} className="border-b border-gray-200 print:border-gray-300">
                      <td className="py-4 px-4 text-center text-sm font-bold text-gray-500">
                        {index + 1}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-gray-900">{item.productName}</p>
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-gray-500">
                        {item.product?.itemMasterId || '-'}
                      </td>
                      <td className="py-4 px-4 text-center text-sm font-bold text-gray-900">
                        {item.quantity} {item.type === 'weight' ? 'kg' : 'pcs'}
                      </td>
                      <td className="py-4 px-4 text-right text-sm text-gray-900">
                        ₹{item.price.toFixed(2)}
                      </td>
                      {bill.billType === 'tax' && (
                        <td className="py-4 px-4 text-center text-sm font-bold text-accent">
                          {getGSTPercentage() / 2}%
                        </td>
                      )}
                      <td className="py-4 px-4 text-right text-sm font-bold text-gray-900">
                        ₹{item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Section */}
          <div className="p-8 print:p-6 bg-gray-50 print:bg-white border-t-2 border-gray-200 print:border-black">
            <div className="flex flex-col md:flex-row md:justify-end">
              <div className="w-full md:w-96 space-y-3">
                {/* Subtotal */}
                <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl print:bg-transparent">
                  <span className="text-sm font-bold text-gray-600">Subtotal</span>
                  <span className="text-lg font-bold text-gray-900">₹{(bill.subtotal || bill.totalAmount).toFixed(2)}</span>
                </div>

                {/* GST Breakdown */}
                {bill.billType === 'tax' && (
                  <>
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl print:bg-transparent">
                      <div className="text-sm text-gray-600">
                        <span className="font-bold">CGST</span>
                        <span className="ml-2 text-xs">({getGSTPercentage() / 2}%)</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">₹{(bill.cgst || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl print:bg-transparent">
                      <div className="text-sm text-gray-600">
                        <span className="font-bold">SGST</span>
                        <span className="ml-2 text-xs">({getGSTPercentage() / 2}%)</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">₹{(bill.sgst || 0).toFixed(2)}</span>
                    </div>
                  </>
                )}

                {/* Total */}
                <div className="flex justify-between items-center py-5 px-6 bg-gradient-to-r from-primary to-primary-light rounded-2xl print:bg-primary print:text-white mt-4">
                  <span className="text-xl font-black text-white">Total</span>
                  <span className="text-3xl font-black text-white">₹{bill.totalAmount.toFixed(2)}</span>
                </div>

                {/* Amount in Words */}
                <div className="mt-6 p-4 bg-white rounded-xl print:bg-transparent print:border print:border-gray-300">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Amount in Words</p>
                  <p className="text-sm font-bold text-gray-900 italic">
                    {numberToWords(bill.totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details & Terms */}
          <div className="p-8 print:p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-t-2 border-gray-200 print:border-black">
            {/* Bank Details */}
            <div>
              <h3 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                Bank Details
              </h3>
              <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-xl print:bg-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">Bank Name</span>
                  <span className="font-bold text-gray-900">HDFC Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">Account Name</span>
                  <span className="font-bold text-gray-900">SPT Traders</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">Account No.</span>
                  <span className="font-mono font-bold text-gray-900">123456789012</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">IFSC Code</span>
                  <span className="font-mono font-bold text-gray-900">HDFC0001234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">Branch</span>
                  <span className="font-bold text-gray-900">Chennai Main</span>
                </div>
              </div>
            </div>

            {/* Terms & Signature */}
            <div>
              <h3 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-4">
                Terms & Conditions
              </h3>
              <div className="space-y-2 text-xs text-gray-500 mb-6">
                <p>1. Goods once sold will not be taken back.</p>
                <p>2. Subject to Chennai jurisdiction.</p>
                <p>3. Payment due within 30 days.</p>
              </div>

              <div className="text-center mt-16">
                <div className="border-t-2 border-gray-300 pt-4 inline-block min-w-48">
                  <p className="text-sm font-bold text-gray-900 mb-1">For {businessSettings?.businessName || 'SPT TRADERS'}</p>
                  <p className="text-xs text-gray-500">Authorized Signatory</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 print:bg-gray-100 p-6 text-center border-t border-gray-200 print:border-black">
            <p className="text-sm text-gray-500">
              This is a computer generated invoice and does not require signature
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Thank you for your business! | Visit us at www.spttraders.com
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:p-6 {
            padding: 1.5rem !important;
          }
          .print\\:p-4 {
            padding: 1rem !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
          .print\\:bg-gray-50 {
            background-color: #f9fafb !important;
          }
          .print\\:bg-gray-100 {
            background-color: #f3f4f6 !important;
          }
          .print\\:bg-accent\\/10 {
            background-color: rgba(251, 146, 60, 0.1) !important;
          }
          .print\\:bg-primary {
            background-color: white !important;
          }
          .print\\:bg-transparent {
            background-color: transparent !important;
          }
          .print\\:text-primary {
            color: #1e40af !important;
          }
          .print\\:text-white {
            color: black !important;
          }
          .print\\:text-gray-900 {
            color: #111827 !important;
          }
          .print\\:text-gray-500 {
            color: #6b7280 !important;
          }
          .print\\:border {
            border-width: 1px !important;
            border-color: #d1d5db !important;
          }
          .print\\:border-black {
            border-color: black !important;
          }
          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }
          .print\\:border-t {
            border-top-width: 1px !important;
          }
          .print\\:border-b-2 {
            border-bottom-width: 2px !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:max-w-none {
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BillDetail;
