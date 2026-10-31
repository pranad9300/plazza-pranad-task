import type { Medicine } from '@/features/catalog';
import { createStore } from '@/core/state';
import type { CartLine } from '../../domain/entities/CartLine';
import { nextQtyAfterIncrement } from '../../domain/rules/qty';

export type CartMutationResult = { ok: true } | { ok: false; reason: string };

type CartState = {
  lines: CartLine[];
  activeCode: string | null;
  addItem: (medicine: Medicine) => CartMutationResult;
  increment: (medicineId: string) => CartMutationResult;
  decrement: (medicineId: string) => CartMutationResult;
  remove: (medicineId: string) => void;
  setActiveCode: (code: string | null) => void;
  clearCart: () => void;
};

function toLine(medicine: Medicine, qty: number): CartLine {
  return {
    medicineId: medicine.id,
    name: medicine.name,
    salt: medicine.salt,
    price: medicine.price,
    maxQty: medicine.maxQty,
    rx: medicine.rx,
    qty,
  };
}

export const useCartStore = createStore<CartState>((set, get) => ({
  lines: [],
  activeCode: null,
  addItem: (medicine) => {
    const existing = get().lines.find((line) => line.medicineId === medicine.id);
    if (!existing) {
      set({ lines: [...get().lines, toLine(medicine, 1)] });
      return { ok: true };
    }
    const nextQty = nextQtyAfterIncrement(existing);
    if (nextQty === null) {
      return { ok: false, reason: `Maximum quantity is ${existing.maxQty}` };
    }
    set({
      lines: get().lines.map((line) =>
        line.medicineId === medicine.id ? { ...line, qty: nextQty } : line,
      ),
    });
    return { ok: true };
  },
  increment: (medicineId) => {
    const existing = get().lines.find((line) => line.medicineId === medicineId);
    if (!existing) {
      return { ok: false, reason: 'Item not in cart' };
    }
    const nextQty = nextQtyAfterIncrement(existing);
    if (nextQty === null) {
      return { ok: false, reason: `Maximum quantity is ${existing.maxQty}` };
    }
    set({
      lines: get().lines.map((line) =>
        line.medicineId === medicineId ? { ...line, qty: nextQty } : line,
      ),
    });
    return { ok: true };
  },
  decrement: (medicineId) => {
    const existing = get().lines.find((line) => line.medicineId === medicineId);
    if (!existing) {
      return { ok: false, reason: 'Item not in cart' };
    }
    if (existing.qty <= 1) {
      set({ lines: get().lines.filter((line) => line.medicineId !== medicineId) });
      return { ok: true };
    }
    set({
      lines: get().lines.map((line) =>
        line.medicineId === medicineId ? { ...line, qty: line.qty - 1 } : line,
      ),
    });
    return { ok: true };
  },
  remove: (medicineId) => {
    set({ lines: get().lines.filter((line) => line.medicineId !== medicineId) });
  },
  setActiveCode: (code) => {
    set({ activeCode: code });
  },
  clearCart: () => {
    set({ lines: [], activeCode: null });
  },
}));
