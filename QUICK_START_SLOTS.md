# 🚀 Quick Start - Slot Purchase System

## 📦 What You Got

A complete, production-ready slot purchase system with:

- ✅ Paystack payment integration
- ✅ Beautiful, responsive UI components
- ✅ Complete error handling
- ✅ TypeScript support
- ✅ Auto-refresh capabilities
- ✅ Mobile-optimized

---

## ⚡ 5-Minute Integration

### Step 1: Set Environment Variable

```env
# frontend/.env.local
NEXT_PUBLIC_API_URL=https://sellr-backend-1.onrender.com
```

### Step 2: Copy This Code Into Your Page

```tsx
"use client";

import { useState } from "react";
import SlotBalance from "@/Components/slots/SlotBalance";
import PurchaseSlotsModal from "@/Components/slots/PurchaseSlotsModal";

export default function YourPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = 1; // TODO: Get from your auth system

  return (
    <div className="p-6">
      {/* Slot Widget */}
      <SlotBalance
        userId={userId}
        onPurchaseClick={() => setIsModalOpen(true)}
      />

      {/* Purchase Modal */}
      <PurchaseSlotsModal
        userId={userId}
        currentSlots={10}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
```

### Step 3: Test It!

```bash
npm run dev
# Open http://localhost:3000
# Click "Purchase Slots"
# Test with Paystack test card: 4084 0840 8408 4081
```

---

## 🎯 Common Use Cases

### 1. Add to Navigation Bar

```tsx
import SlotIndicator from "@/Components/slots/SlotIndicator";

<nav>
  <SlotIndicator
    userId={userId}
    onClick={() => router.push("/slots")}
    variant="compact"
  />
</nav>;
```

### 2. Check Before Listing Product

```tsx
import { slotService } from "@/services/slotService";

const handleCreateProduct = async () => {
  const slots = await slotService.getUserSlots(userId);

  if (!slots || slots.availableSlots === 0) {
    alert("No slots available! Purchase more.");
    setShowPurchaseModal(true);
    return;
  }

  // Proceed with product creation...
};
```

### 3. Show Slot Count in Dashboard

```tsx
import SlotBalance from "@/Components/slots/SlotBalance";

<SlotBalance userId={userId} autoRefresh={true} refreshInterval={30000} />;
```

---

## 📁 Files Reference

| File                                      | Purpose           |
| ----------------------------------------- | ----------------- |
| `types/slots.ts`                          | TypeScript types  |
| `services/slotService.ts`                 | Business logic    |
| `api/slots/purchase/route.ts`             | Purchase API      |
| `api/slots/[userId]/route.ts`             | Get slots API     |
| `Components/slots/SlotBalance.tsx`        | Full widget       |
| `Components/slots/PurchaseSlotsModal.tsx` | Purchase modal    |
| `Components/slots/SlotIndicator.tsx`      | Compact indicator |
| `slots-dashboard/page.tsx`                | Example page      |
| `payment-success/page.tsx`                | Callback page     |

---

## 🔧 Configuration

### Backend Environment (.env)

```env
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_CALLBACK_URL=https://your-frontend.vercel.app/payment-success
```

### Frontend Environment (.env.local)

```env
NEXT_PUBLIC_API_URL=https://sellr-backend-1.onrender.com
```

---

## 🧪 Testing

### Paystack Test Cards

**Success:**

```
Card: 4084 0840 8408 4081
CVV: 408
Exp: 12/30
PIN: 0000
OTP: 123456
```

**Failure:**

```
Card: 5060 6666 6666 6666 6666
```

---

## 🎨 Component Props

### SlotBalance

```tsx
<SlotBalance
  userId={1} // Required
  onPurchaseClick={() => {}} // Optional
  showPurchaseButton={true} // Optional
  autoRefresh={false} // Optional
  refreshInterval={30000} // Optional (ms)
/>
```

### PurchaseSlotsModal

```tsx
<PurchaseSlotsModal
  userId={1} // Required
  currentSlots={10} // Required
  isOpen={true} // Required
  onClose={() => {}} // Optional
  onSuccess={() => {}} // Optional
/>
```

### SlotIndicator

```tsx
<SlotIndicator
  userId={1} // Required
  onClick={() => {}} // Optional
  showLabel={true} // Optional
  variant="compact" // Optional: "compact" | "full"
/>
```

---

## 🔄 Payment Flow

```
User → Click "Purchase"
     → Select Quantity
     → Click "Pay"
     → Redirect to Paystack
     → Complete Payment
     → Redirect to /payment-success
     → Webhook Credits Slots
     → Done! ✅
```

---

## 🚨 Troubleshooting

### "Not authenticated" error

```tsx
// Ensure cookies are sent
fetch("/api/slots/purchase", {
  credentials: "include", // ← Add this
});
```

### Slots not updating after payment

```tsx
// Force refresh after successful payment
window.location.reload();
// Or better: refetch slots data
```

### Modal not showing

```tsx
const [isOpen, setIsOpen] = useState(false);

// Make sure isOpen is passed correctly
<PurchaseSlotsModal isOpen={isOpen} ... />
```

---

## 📞 Quick Checklist

- [ ] Added `NEXT_PUBLIC_API_URL` to `.env.local`
- [ ] Backend has correct `PAYSTACK_CALLBACK_URL`
- [ ] Imported components in your page
- [ ] Passing correct `userId` prop
- [ ] Tested with Paystack test card
- [ ] Payment success page works
- [ ] Webhook is receiving events (check backend logs)

---

## 🎓 Advanced Usage

### Custom Hook

```tsx
import { useSlots } from "@/hooks/useSlots";

function MyComponent() {
  const { slots, isLoading, purchaseSlots } = useSlots(userId);

  return (
    <div>
      <p>Slots: {slots}</p>
      <button onClick={() => purchaseSlots(5)}>Buy 5</button>
    </div>
  );
}
```

### Direct Service Usage

```tsx
import { slotService } from "@/services/slotService";

// Purchase
const result = await slotService.purchaseSlots(userId, 10);

// Get slots
const slots = await slotService.getUserSlots(userId);

// Calculate cost
const cost = slotService.calculateCost(10); // GHS 10
```

---

## 🎉 Done!

Your slot purchase system is ready to use. See `SLOT_PURCHASE_SYSTEM.md` for detailed documentation.

**Need help?** Check `IntegrationExamples.tsx` for 6 real-world integration patterns!

---

Built with ❤️ using React, Next.js, TypeScript, and Paystack
