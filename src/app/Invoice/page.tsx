import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React from 'react';

const Invoice = () => {

  const items = [
    { quantity: 100, description: 'Decorative clay pottery (LG)', unitPrice: 13.00, total: 1300.00 },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },
    { quantity: "", description: '', unitPrice: "", total: "" },


  ];
  return (
    <>
      <DefaultLayout>
        <div className="max-w-4xl mx-auto bg-white p-6 shadow-md text-black">
          <div className="text-left mb-3">
            <div className='flex justify-between'>
              <div>
                <h1 className="text-lg font-bold">Pottery & Co.</h1>
                <p className="text-sm italic">Earthenware for everyone</p>
              </div>
              <div>
                <h1 className='text-2xl font-medium text-graydark'>INVOICE</h1>
              </div>

            </div>

            <p className="text-sm mt-2">89 Pacific Ave, San Francisco CA 45321</p>
            <div className='flex justify-between'>
              <div className='text-sm'>
                <p>Phone: (123) 456-7890 </p>
                <p>Fax: (123) 456-7891 </p>
              </div>
              <div className='text-sm'>
                <p>Invoice #100</p>
                <p>Date: 1/1/23</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-16 mb-1 w-3/4">
            <div className="text-left clear-start w-1/2">
              <p className=" font-semibold">Bill To:</p>
              <div className='text-sm'>
                <p>Mollie Grau</p>
                <p>Perfect Places Interior Design</p>
                <p>210 Stars Avenue </p>
                <p>Berkeley CA 78910</p>
                <p>(123) 987-6543</p>
              </div>
            </div>
            <div className="text-left w-1/2">
              <p className=" font-semibold">Ship To:</p>
              <div className='text-sm'>
                <p>Mollie Grau</p>
                <p>Perfect Places Interior Design</p>
                <p>210 Stars Avenue</p>
                <p>Berkeley CA 78910</p>
                <p>(123) 987-6543</p>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <p className="font-semibold"> Comments or special instructions: </p>
            <p className='text-sm'>Shipment contains fragile goods</p>
          </div>

          <table className="min-w-full table-auto border-collapse border border-gray-300 mt-4 overflow-x-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr className='text-[11px]'>
                <th className="border border-gray-300 px-4  text-left">SALESPERSON</th>
                <th className="border border-gray-300 px-4  text-left">P.O. NUMBER</th>
                <th className="border border-gray-300 px-4  text-left">REQUISITIONER</th>
                <th className="border border-gray-300 px-4  text-left">SHIPPED VIA</th>
                <th className="border border-gray-300 px-4  text-left">F.O.B. POINT</th>
                <th className="border border-gray-300 px-4  text-left">TERMS</th>
              </tr>
            </thead>
            <tbody className="text-gray-900 text-[11px]">
              <tr>
                <td className="border border-gray-300 px-4 ">Suman</td>
                <td className="border border-gray-300 px-4 ">143</td>
                <td className="border border-gray-300 px-4 ">Nathan Rigby</td>
                <td className="border border-gray-300 px-4 ">Express Air</td>
                <td className="border border-gray-300 px-4 ">Warehouse</td>
                <td className="border border-gray-300 px-4 ">Due on receipt</td>
              </tr>
            </tbody>
          </table>

          <table className="min-w-full table-auto border-collapse border border-gray-300 mt-3 overflow-x-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr className='text-[11px]'>
                <th className="border border-gray-300 px-4  text-left">QUANTITY</th>
                <th className="border border-gray-300 px-4  text-left">DESCRIPTION</th>
                <th className="border border-gray-300 px-4  text-left">UNIT PRICE</th>
                <th className="border border-gray-300 px-4  text-left">TOTAL</th>
              </tr>
            </thead>
            <tbody className="text-gray-900">
              {items.map((item, index) => (
                <tr key={index} className="h-6 text-[11px]">
                  <td className="border border-gray-300 px-4 ">{item.quantity}</td>
                  <td className="border border-gray-300 px-4 ">{item.description}</td>
                  <td className="border border-gray-300 px-4 ">{item.unitPrice}</td>
                  <td className="border border-gray-300 px-4 ">{item.total}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="border-none px-4 text-[11px] text-right font-medium">SUBTOTAL</td>
                <td className="border border-gray-300 px-4 text-[11px]">1300.00</td>
              </tr>
              <tr>
                <td colSpan={3} className="border-none px-4  text-right font-medium text-[11px]">SALES TAX</td>
                <td className="border border-gray-300 px-4  text-[11px]">65.00</td>
              </tr>
              <tr>
                <td colSpan={3} className="border-none px-4  text-right font-medium text-[11px]">SHIPPING & HANDLING</td>
                <td className="border border-gray-300 px-4  text-[11px]">24.99</td>
              </tr>
              <tr>
                <td colSpan={3} className="border-none px-4  text-right font-medium text-[11px]">TOTAL DUE</td>
                <td className="border border-gray-300 px-4  text-xl font-medium text-[11px]">1389.99</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-8 text-sm">
            <p className='font-medium'>Make all checks payable to Pottery & Co.</p>
            <p className='font-medium'>If you have any questions concerning this invoice contact: Suman at (123) 456-7890</p>
            <p className="mt-4 font-bold text-center">THANK YOU FOR YOUR BUSINESS!</p>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
}

export default Invoice;
