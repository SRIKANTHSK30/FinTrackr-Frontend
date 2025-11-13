// src/components/dashboard/Cards.tsx
import { useState, useEffect } from "react";
import {
  Wallet,
  CreditCard,
  TrendingUp,

  PlusCircle,
  Shield,
  Eye, 
  EyeOff,
} from "lucide-react";
import CountUp from "react-countup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import AddCardDialog from "./AddCardDialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { bank, cardTypeAccent } from "@/constants/constants";
import { api } from "@/lib/api";
import type { Card as CardType, CardPayload } from "@/types/index";

export default function Cards() {

  const [openDialog, setOpenDialog] = useState(false);
  const [cards, setCards] = useState<CardType[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [showFullNumber, setShowFullNumber] = useState(false);

  // Fetch cards from API on mount
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await api.cards.getAll();
        const formattedCards: CardType[] = data.map((card) => {
          const status: "Active" | "Inactive" = card.status === "Inactive" ? "Inactive" : "Active";
          return {
            ...card,
            status,
            masked: `•••• •••• ${card.number.slice(-4)}`,
            gradient: bank[card.bank] || "from-gray-500 via-gray-400 to-gray-300",
            border: cardTypeAccent[card.type] || "",
          };
        });
        setCards(formattedCards);
        setSelectedCard(formattedCards[0] || null);
      } catch (error) {
        console.error("Failed to fetch cards:", error);
        toast.error("Failed to fetch cards. Please try again.", { position: "top-right", autoClose: 3000 });
      }
    };
    fetchCards();
  }, []);

  // Calculate dynamic stats
  const totalBalance = cards.reduce((sum, card) => sum + Number(card.balance), 0);
  const activeCount = cards.filter(c => c.status === "Active").length;
  const activeCards = `${activeCount} / ${cards.length}`;
  const avgBalance = cards.length ? totalBalance / cards.length : 0;
  const lowBalance = cards
  .filter(c => Number(c.balance) < 1000)
  .map(c => `${c.bank} - ₹${Number(c.balance).toLocaleString()}`);

   const stats = [
  {
    name: "Total Balance",
    value: totalBalance,
    icon: <Wallet className="h-5 w-5 text-blue-500" />,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "Active Cards",
    value: activeCards,
    icon: <CreditCard className="h-5 w-5 text-orange-500" />,
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "Average Balance",
    value: avgBalance,
    icon: <TrendingUp className="h-5 w-5 text-green-500" />,
    color: "text-green-600 dark:text-green-400",
  },
  {
    name: "Low Balance Cards",
    value: lowBalance.length,
    details: lowBalance, // bank name + balance
    icon: <Wallet className="h-5 w-5 text-yellow-500" />,
    color: "text-yellow-600 dark:text-yellow-400",
  },
];

  // Handle adding a new card
  const handleAddCard = async (newCard: CardPayload) => {
  const toastId = toast.info("Adding new card...", { autoClose: false, closeButton: false, position: "top-right" });
  try {
    const savedCard = await api.cards.create(newCard);

    // Prepare the new card object
    const updatedCard: CardType = {
      ...savedCard,
      status: "Active", // new card becomes active
      masked: `•••• •••• ${savedCard.number.slice(-4)}`,
      gradient: bank[savedCard.bank] || "from-gray-500 via-gray-400 to-gray-300",
      border: cardTypeAccent[savedCard.type] || "",
    };

    // Update frontend: new card active, others inactive
   setCards((prev: CardType[]) =>
  [
    updatedCard,
    ...prev.map((c: CardType) => ({
      ...c,
      status: "Inactive" as "Active" | "Inactive"
    }))
  ]
);
    // Update backend: new card active
    await api.cards.update(String(savedCard.id), { status: "Active" });

    // Update backend: set other cards inactive
    const otherCards = cards.filter(c => c.id !== savedCard.id);
    for (const card of otherCards) {
      await api.cards.update(String(card.id), { status: "Inactive" });
    }

    setSelectedCard(updatedCard); // select new card
    toast.update(toastId, { 
      render: "Card added and set as default!", 
      type: "success", autoClose: 3000, closeButton: true 
    });

  } catch (error) {
    console.error("Failed to add card:", error);
    toast.update(toastId, { 
      render: "Failed to add card. Please try again.", 
      type: "error", autoClose: 3000, closeButton: true 
    });
  }
};


  // Handle setting default card
  const handleSetDefault = async (cardId: string | number) => {
    const toastId = toast.info("Setting default card...", { autoClose: false, closeButton: false, position: "top-right" });
    try {
      setCards((prev) =>
        prev.map((c) =>
          c.id === cardId
            ? { ...c, status: "Active", default: true }
            : { ...c, status: "Inactive", default: false }
        )
      );
      setSelectedCard((prev) => (prev ? { ...prev, status: "Active", default: true } : null));

      await api.cards.update(String(cardId), { status: "Active" });
      const otherCards = cards.filter((c) => c.id !== cardId);
      for (const card of otherCards) {
        await api.cards.update(String(card.id), { status: "Inactive" });
      }

      toast.update(toastId, { 
        render: "Default card set successfully!", 
        type: "success",
        autoClose: 3000, 
        closeButton: true 
      });
    } catch (error) {
      console.error("Failed to set default card:", error);
      toast.update(toastId, {
         render: "Failed to set default card.", 
         type: "error", 
         autoClose: 3000, 
         closeButton: true 
        });
    }
  };
 const handleRemoveCard = (cardId: string | number) => {
  toast(
  ({ closeToast }) => (
    <div className="flex flex-col gap-4 p-4 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-red-500" fill="currentColor" />
        <p className="text-black dark:text-gray-400 font-semibold text-md">Confirm Removal</p>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Are you sure you want to remove this card? This action cannot be undone.
      </p>
     <div className="flex justify-center gap-3 mt-2">
        <button
          className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition"
          onClick={() => closeToast()}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 flex items-center gap-2 transition transform -translate-x-1"
          onClick={async () => {
            closeToast();
            const toastId = toast.info("Removing card...", { autoClose: false, closeButton: false, position: "top-right" });
            try {
              await api.cards.delete(String(cardId));
              setCards((prev) => prev.filter((c) => c.id !== cardId));
              setSelectedCard((prev) => {
                if (prev?.id === cardId) {
                  const remaining = cards.filter((c) => c.id !== cardId);
                  return remaining[0] || null;
                }
                return prev;
              });
              toast.update(toastId, {
                render: "Card removed successfully!",
                type: "success",
                autoClose: 3000,
                closeButton: true,
              });
            } catch (error) {
              console.error("Failed to remove card:", error);
              toast.update(toastId, {
                render: "Failed to remove card.",
                type: "error",
                autoClose: 3000,
                closeButton: true,
              });
            }
          }}
        >
          <CreditCard className="w-4 h-4" />
          Remove
        </button>
      </div>
    </div>
  ),
  {
    autoClose: false,
    closeOnClick: false,
    style: {
      background: "transparent",
      boxShadow: "none",
      padding: 0,
    },
  }
);

};


  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#141414] dark:text-gray-100 p-8 transition-colors duration-300">
      <ToastContainer />
      
      {/* ===== Stats Overview ===== */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
        {stats.map((stat) => (
          <Card
            key={stat.name}
            className="bg-white dark:bg-[#1b1b1b] border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-md transition-all"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {stat.icon}
                {stat.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
  <div className={`text-2xl font-bold flex flex-col gap-1 ${stat.color}`}>
    {stat.name === "Active Cards" ? (
      <span>{stat.value}</span>
    ) : stat.name === "Low Balance Cards" ? (
      stat.details && stat.details.length > 0 ? (
        <span className="text-lg font-bold mt-1 text-yellow-700 dark:text-yellow-400">
          {stat.details} {/* just the first bank + balance */}
        </span>
      ) : (
        <span className="text-sm font-medium mt-1 text-yellow-700 dark:text-yellow-400">
          None
        </span>
      )
    ) : (
      <span>
        ₹<CountUp end={stat.value as number} duration={1.5} separator="," decimals={2} />
      </span>
    )}
  </div>
</CardContent>
          </Card>
        ))}
      </div>

      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Your Cards</h2>
          <p className="font-semibold text-gray-500 dark:text-gray-400 text-md mt-2">
            Manage your payment cards and balances
          </p>
        </div>
        <div className="relative mr-[26rem]">
        <Button
          className="bg-orange-600 hover:bg-orange-700 text-white -ml-16"
          onClick={() => {
            if (cards.length >= 3) {
              toast.error("You have reached the limit of adding cards (max 3).");
              return;
            }
            setOpenDialog(true);
          }}
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add New Card
        </Button>
        </div>
      </div>

      {/* ===== Cards Section ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_380px] gap-8">
        {/* Left: Cards List */}
        <div className="col-span-2 space-y-6">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => {
                setSelectedCard(card);
                setShowFullNumber(false);
              }}
              className={`flex items-center justify-between rounded-2xl p-4 cursor-pointer transition-all
                ${
                  selectedCard?.id === card.id
                    ? "border-2 border-orange-500/70 dark:border-orange-400/70 bg-orange-500/5 dark:bg-orange-500/10 shadow-lg scale-[1.01]"
                    : "border border-orange-500/40 dark:border-orange-400/40 dark:bg-black/30 hover:bg-orange-500/5 dark:hover:bg-orange-500/10"
                }`}
            >
              {/* Gradient Card */}
              <div
                className={`rounded-xl bg-gradient-to-r ${card.gradient} p-6 text-white w-[320px] h-[200px] flex flex-col justify-between`}
              >
                <div className="flex justify-between items-start">
                  <CreditCard className="w-6 h-6 opacity-80" />
                  <p className="font-bold">{card.type}</p>
                </div>
                <p className="text-lg tracking-widest font-semibold">{card.number}</p>
                <div className="flex justify-between text-sm mt-2">
                  <div>
                    <p className="font-semibold text-zinc-300 text-xs">CARD HOLDER NAME</p>
                    <p className="font-semibold">{card.holder}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-zinc-300 text-xs">EXPIRY DATE</p>
                    <p className="font-semibold">{card.expiry}</p>
                  </div>
                </div>
              </div>

              {/* Right Info */}
              <div className="flex-1 ml-6 text-sm">
                <div className="flex items-center gap-3 mb-10">
                  <p className="font-bold text-lg">{card.type}</p>
                  <Badge
                    className={`rounded-xl px-3 h-7 border ${
                      card.status === "Active"
                        ? "bg-green-500/15 text-green-500 border-green-500/30"
                        : "bg-red-500/15 text-red-500 border-red-500/30"
                    }`}
                  >
                    {card.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400 text-md">Bank</p>
                    <p className="font-semibold mt-2">{card.bank}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400 text-md">Card Number</p>
                    <p className="font-semibold mt-2">{card.masked}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400 text-md">Expires</p>
                    <p className="font-semibold mt-2">{card.expiry}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400 text-md">Card Holder</p>
                    <p className="font-semibold mt-2">{card.holder}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Card Details */}
        {selectedCard && (
          <Card className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white p-6 shadow-lg transition-colors duration-300 h-[710px] overflow-hidden -mt-20">
            <CardHeader className="flex flex-col items-start p-0 mb-4">
              <div className="flex items-center gap-2 mt-1">
                <CreditCard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <CardTitle className="font-semibold text-lg">Card Details</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-7 -mx-4 transition-all duration-500 animate-fade-in">
              {/* Current Balance */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-transparent">
                <p className="font-semibold text-gray-500 dark:text-gray-400 text-sm">Current Balance</p>
                <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100">
                  ₹ {selectedCard.balance} INR
                </p>
              </div>

              {/* Card Info */}
              <div className="space-y-8 text-sm">
                {["bank", "type", "holder", "number", "expiry", "status"].map((field) => {
                  const labelMap: Record<string, string> = {
                    bank: "Bank Name",
                    type: "Card Type",
                    holder: "Card Holder",
                    number: "Card Number",
                    expiry: "Expiry Date",
                    status: "Status",
                  };
                  const value =
                    field === "number"
                      ? showFullNumber
                        ? selectedCard.number
                        : selectedCard.masked
                      : (selectedCard as any)[field];

                  return (
                    <div key={field} className="flex justify-between">
                      <p className="font-semibold text-gray-500 dark:text-gray-400">
                        {labelMap[field]}
                      </p>
                      {field === "status" ? (
                        <Badge
                          className={`rounded-xl px-3 h-7 border ${
                            selectedCard.status === "Active"
                              ? "bg-green-500/15 text-green-500 border-green-500/30"
                              : "bg-red-500/15 text-red-500 border-red-500/30"
                          }`}
                        >
                          {value}
                        </Badge>
                      ) : (
                        <p className="font-semibold text-gray-900 dark:text-gray-200">{value}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Buttons */}
              <div className="pt-4 space-y-3">
                <Button
                  variant="outline"
                  onClick={() => setShowFullNumber(!showFullNumber)}
                  className="w-full flex items-center gap-2 h-11"
                >   
                  {showFullNumber ? <EyeOff className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-[1px]" /> : <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-[1px]"/>}
                  <span className="flex items-center">
                    {showFullNumber ? "Hide Card Number" : "Show Card Number"}
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 h-11"
                  onClick={() => handleSetDefault(selectedCard?.id)}
                >
                  <Shield className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-[1px]" />
                  <span className="flex items-center mb-[1px]">{`Set as Default`}</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 h-11 justify-center"
                  onClick={() => selectedCard && handleRemoveCard(selectedCard.id)}
                >
                  <CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-[1px]" />
                  <span className="flex items-center mb-[1px]">{`Remove Card`}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Card Dialog */}
      <AddCardDialog open={openDialog} onClose={() => setOpenDialog(false)} onAddCard={handleAddCard} />
    </div>
  );
}
