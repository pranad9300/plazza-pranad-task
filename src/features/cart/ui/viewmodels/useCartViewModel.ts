import { useMemo } from 'react';
import { useDependencies } from '@/di/DependenciesProvider';
import { calculateBill, itemTotalOf } from '../../domain/rules/bill';
import { useCartStore } from '../state/cartStore';

export function useCartViewModel() {
  const { toast } = useDependencies();
  const lines = useCartStore((state) => state.lines);
  const activeCode = useCartStore((state) => state.activeCode);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const remove = useCartStore((state) => state.remove);

  const itemTotal = useMemo(() => itemTotalOf(lines), [lines]);
  const bill = useMemo(() => calculateBill(itemTotal, null), [itemTotal]);

  return {
    lines,
    activeCode,
    bill,
    isEmpty: lines.length === 0,
    increment: (medicineId: string) => {
      const result = increment(medicineId);
      if (!result.ok) {
        toast.show(result.reason);
      }
    },
    decrement: (medicineId: string) => {
      const result = decrement(medicineId);
      if (!result.ok) {
        toast.show(result.reason);
      }
    },
    remove: (medicineId: string) => {
      remove(medicineId);
    },
  };
}
