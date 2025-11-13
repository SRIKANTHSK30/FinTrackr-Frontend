import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { bank, cardTypeAccent, cardTypes } from "@/constants/constants";
interface AddCardDialogProps {
  open: boolean;
  onClose: () => void;
  onAddCard: (card: any) => void;
}



export default function AddCardDialog({
  open,
  onClose,
  onAddCard,
}: AddCardDialogProps) {
  const [form, setForm] = useState({
    bank: "",
    type: "",
    holder: "",
    number: "",
    expiry: "",
    balance: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  if (name === "number") {
    // Only allow digits
    let digitsOnly = value.replace(/\D/g, "").substr(0, 16);
    // Format as 4-4-4-4
    const formatted = digitsOnly.match(/.{1,4}/g)?.join(" ") || "";
    setForm({ ...form, number: formatted });
  } else if (name === "expiry") {
    // Only allow digits and auto-insert '/'
    let digitsOnly = value.replace(/\D/g, "").substr(0, 4);
    if (digitsOnly.length > 2) {
      digitsOnly = digitsOnly.substr(0,2) + "/" + digitsOnly.substr(2);
    }
    setForm({ ...form, expiry: digitsOnly });
  } else {
    setForm({ ...form, [name]: value });
  }

  // Clear error on change
  setErrors({ ...errors, [name]: "" });
};

  const validate = () => {
  const newErrors: { [key: string]: string } = {};

  // Bank Name
  if (!form.bank.trim()) newErrors.bank = "Bank name is required.";
  else if (!/^[a-zA-Z ]{3,}$/.test(form.bank))
    newErrors.bank = "Bank name must be at least 3 letters and only contain alphabets.";

  // Card Type
  if (!form.type) newErrors.type = "Please select a card type.";

  // Card Holder
  if (!form.holder.trim()) newErrors.holder = "Card holder name is required.";
  else if (!/^[a-zA-Z ]{3,}$/.test(form.holder))
    newErrors.holder = "Name must be at least 3 letters and only contain alphabets.";

  // Card Number
  const digitsOnly = form.number.replace(/\s/g, "");
  if (!digitsOnly) newErrors.number = "Card number is required.";
  else if (!/^\d{16}$/.test(digitsOnly)) newErrors.number = "Card number must be 16 digits.";

  // Expiry
  if (!form.expiry) newErrors.expiry = "Expiry date is required.";
  else if (!/^\d{2}\/\d{2}$/.test(form.expiry))
    newErrors.expiry = "Expiry must be in MM/YY format.";
  else {
    const [mm, yy] = form.expiry.split("/").map(Number);
    if (mm < 1 || mm > 12) newErrors.expiry = "Month must be between 01 and 12.";
    else {
      const now = new Date();
      const expDate = new Date(2000 + yy, mm - 1, 1);
      if (expDate < new Date(now.getFullYear(), now.getMonth(), 1))
        newErrors.expiry = "Expiry date cannot be in the past.";
    }
  }

  // Balance
  if (!form.balance) newErrors.balance = "Initial balance is required.";
  else if (isNaN(Number(form.balance)) || Number(form.balance) < 0)
    newErrors.balance = "Balance must be a positive number.";

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onAddCard({
      ...form,
      status: "Active",
      gradient: "from-[#232526] via-[#414345] to-[#6b7280]",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] !max-w-[500px] rounded-3xl border shadow-2xl p-6 bg-white text-gray-900 dark:border-gray-700/40 dark:bg-gradient-to-b dark:from-[#111111] dark:via-[#1a1a1a] dark:to-[#0d0d0d] dark:text-gray-100 dark:shadow-black/50 transition-all duration-300">
        <DialogHeader className="mb-6">
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-500">
            <CreditCard className="w-5 h-5" />
            <DialogTitle className="text-2xl font-bold">
             Add New Card
            </DialogTitle>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Fill in the details below to register your new card.
          </p>
        </DialogHeader>

        {/* Live Card Preview */}
       <div
  className={`w-full rounded-2xl p-4 mb-6 text-white shadow-lg transform transition-transform duration-300 hover:scale-105
    bg-gradient-to-r ${bank[form.bank] || "from-gray-500 via-gray-400 to-gray-300"} ${
    cardTypeAccent[form.type] || ""
  }`}
>
  <div className="flex justify-between items-center mb-4">
    <CreditCard className="w-6 h-6 opacity-80" />
    <div className="flex-1 ml-2 truncate font-semibold text-md opacity-90">
      {form.bank || "BANK NAME"}
    </div>
    <span className="font-bold text-sm">{form.type || "CARD"}</span>
  </div>
  <div className="mb-4">
    <div className="font-semibold text-sm opacity-80">CARD NUMBER</div>
    <div className="font-semibold text-lg tracking-widest mt-1">
      {form.number || "#### #### #### ####"}
    </div>
  </div>
  <div className="flex justify-between text-sm opacity-90">
    <div>
      <div className="font-semibold text-sm opacity-80">CARD HOLDER NAME</div>
      <div className="font-semibold mt-1">{form.holder || "CARD HOLDER NAME"}</div>
    </div>
    <div>
      <div className="font-semibold text-sm opacity-80">EXPIRY</div>
      <div className="font-semibold mt-1">{form.expiry || "MM/YY"}</div>
    </div>
  </div>
</div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Row 1: Bank Name + Card Type */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  {/* Bank Dropdown */}
  <div className="relative">
    <Label className="text-gray-700 dark:text-gray-300 mb-2">Bank Name</Label>
    <button
      type="button"
      onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
      className="w-full flex justify-between items-center rounded-xl bg-gray-50 dark:bg-[#1f1f1f] border border-gray-300 dark:border-gray-700/60 text-gray-900 dark:text-gray-100 py-2 px-4 shadow-md hover:shadow-lg mt-2"
    >
      {form.bank || "Select Bank"}
      <svg className={`w-5 h-5 transition-transform duration-200 ${isBankDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {isBankDropdownOpen && (
  <div className="absolute mt-1 w-full bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto scrollbar-none">
    {Object.keys(bank).map((bankName) => (
      <button
        key={bankName}
        type="button"
        onClick={() => {
          setForm({ ...form, bank: bankName });
          setIsBankDropdownOpen(false);
        }}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
      >
        {bankName}
      </button>
    ))}
  </div>
)}
  </div>

            <div className="relative">
              <Label className="text-gray-700 dark:text-gray-300 mb-2">Card Type</Label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex justify-between items-center rounded-xl bg-gray-50 dark:bg-[#1f1f1f] border border-gray-300 dark:border-gray-700/60 text-gray-900 dark:text-gray-100 py-2 px-4 shadow-md hover:shadow-lg mt-2"
              >
                {form.type || "Select type"}
                <svg className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute mt-1 w-full bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg z-50">
                  {cardTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, type });
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </div>
          </div>

          {/* Row 2: Card Number */}
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Card Number</Label>
            <Input
              name="number"
              placeholder="#### #### #### ####"
              value={form.number}
              onChange={handleChange}
              required
              maxLength={19}
              className="bg-gray-50 border-gray-300 text-gray-900 tracking-widest dark:bg-[#1f1f1f] dark:border-gray-700/60 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 py-2.5 px-3 mt-2"
            />
            {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
          </div>

          {/* Row 3: Card Holder + Expiry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Card Holder</Label>
              <Input
                name="holder"
                placeholder="e.g., Alexander Munoz"
                value={form.holder}
                onChange={handleChange}
                required
                className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-[#1f1f1f] dark:border-gray-700/60 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 py-2.5 px-3 mt-2"
              />
              {errors.holder && <p className="text-red-500 text-sm mt-1">{errors.holder}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Expiry Date</Label>
              <Input
                name="expiry"
                placeholder="MM/YY"
                value={form.expiry}
                onChange={handleChange}
                required
                className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-[#1f1f1f] dark:border-gray-700/60 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 py-2.5 px-3 mt-2"
              />
              {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
            </div>
          </div>

          {/* Row 4: Initial Balance */}
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Initial Balance</Label>
            <Input
              name="balance"
              placeholder="₹ 0.00"
              value={form.balance}
              onChange={handleChange}
              required
              className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-[#1f1f1f] dark:border-gray-700/60 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 py-2.5 px-3 mt-2"
            />
            {errors.balance && <p className="text-red-500 text-sm mt-1">{errors.balance}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-5 border-t border-gray-200 dark:border-gray-700/60 mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700/60 dark:text-gray-300 dark:hover:bg-[#2a2a2a] dark:hover:text-white">
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-orange-600 to-pink-500 hover:from-orange-500 hover:to-pink-400 text-white font-semibold px-6 py-2 rounded-lg shadow-lg">
              Add Card
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
