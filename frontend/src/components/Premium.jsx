import React from "react";
import axiosInstance from "../utils/axiosConfig";

const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const Premium = () => {
  const handleBuyClick = async (type) => {
    try {
      // create order on your backend
      const order = await axiosInstance.post("/payment/create", {
        membershipType: type,
      });

      const { amount, keyId, currency, notes, orderId } = order.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "DevTinder",
        description: "Connect to other developers",
        order_id: orderId,
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: notes.email,
          contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Error creating order or opening Razorpay:", err);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-stretch">
          {/* Silver Plan */}
          <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-between group transition-colors hover:bg-white/5">
            <div className="flex flex-col items-center w-full">
              <h2 className="text-3xl font-bold text-gray-100 mb-8 tracking-tight">
                Silver Membership
              </h2>

              <ul className="space-y-4 w-full max-w-xs text-gray-300 text-sm md:text-base mb-10">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-3"></span>
                  Chat with other people
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-3"></span>
                  100 connection Requests per day
                </li>
                <li className="flex items-center">
                  <CheckIcon />
                  <span className="text-blue-400 font-medium">Blue Tick</span>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-3"></span>
                  3 months duration
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleBuyClick("silver")}
              className="relative overflow-hidden w-full max-w-[200px] py-3 rounded-xl font-semibold text-white bg-pink-600 hover:bg-pink-500 transition-all duration-300 shadow-[0_0_20px_rgba(233,30,99,0.3)] hover:shadow-[0_0_30px_rgba(233,30,99,0.5)] transform hover:-translate-y-1 active:translate-y-0"
            >
              Buy Silver
            </button>
          </div>

          {/* Divider with OR */}
          <div className="relative flex items-center justify-center md:w-px w-full md:py-12 py-0">
            <div className="hidden md:block w-px h-full bg-gradient-to-b from-transparent via-gray-700 to-transparent absolute"></div>
            <div className="block md:hidden w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent absolute"></div>

            <div className="relative z-20 bg-[#0f0f11] border border-gray-700 text-gray-400 text-xs font-bold rounded-full w-10 h-10 flex items-center justify-center uppercase tracking-widest shadow-lg">
              OR
            </div>
          </div>

          {/* Gold Plan */}
          <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-between group transition-colors hover:bg-white/5">
            <div className="flex flex-col items-center w-full">
              <h2 className="text-3xl font-bold text-gray-100 mb-8 tracking-tight">
                Gold Membership
              </h2>

              <ul className="space-y-4 w-full max-w-xs text-gray-300 text-sm md:text-base mb-10">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-3"></span>
                  Chat with other people
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-3"></span>
                  Infinite connection Requests
                </li>
                <li className="flex items-center">
                  <CheckIcon />
                  <span className="text-blue-400 font-medium">Blue Tick</span>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-3"></span>
                  6 months duration
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleBuyClick("gold")}
              className="relative overflow-hidden w-full max-w-[200px] py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transform hover:-translate-y-1 active:translate-y-0"
            >
              Buy Gold
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-500 mt-6 text-sm">
        All plans include 24/7 customer support and a 7-day money-back
        guarantee.
      </p>
    </div>
  );
};

export default Premium;
