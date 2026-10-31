import { useCallback, useMemo, useState } from 'react';
import {
  evaluateCoupon,
  listCouponRules,
  type CouponEffect,
} from '@/features/coupons';
import { useDependencies } from '@/di/DependenciesProvider';
import { calculateBill, itemTotalOf } from '../../domain/rules/bill';
import { useCartStore } from '../state/cartStore';

export function useCartViewModel() {
  const { toast, usedCouponsRepository } = useDependencies();
  const lines = useCartStore((state) => state.lines);
  const activeCode = useCartStore((state) => state.activeCode);
  const incrementStore = useCartStore((state) => state.increment);
  const decrementStore = useCartStore((state) => state.decrement);
  const removeStore = useCartStore((state) => state.remove);
  const setActiveCode = useCartStore((state) => state.setActiveCode);
  const clearCart = useCartStore((state) => state.clearCart);
  const [usedVersion, setUsedVersion] = useState(0);

  const usedCodes = useMemo(() => {
    void usedVersion;
    return usedCouponsRepository.getUsed();
  }, [usedCouponsRepository, usedVersion]);

  const itemTotal = useMemo(() => itemTotalOf(lines), [lines]);
  const lineCount = lines.length;

  const couponContext = useMemo(
    () => ({
      itemTotal,
      lineCount,
      usedCodes: new Set(usedCodes),
    }),
    [itemTotal, lineCount, usedCodes],
  );

  const applied = activeCode ? evaluateCoupon(activeCode, couponContext) : null;
  const effect: CouponEffect | null = applied?.ok ? applied.effect : null;
  const bill = useMemo(() => calculateBill(itemTotal, effect), [itemTotal, effect]);

  const couponItems = useMemo(() => {
    return listCouponRules().map((rule) => {
      if (activeCode === rule.code && applied?.ok) {
        return { rule, status: 'applied' as const };
      }
      const eligibility = rule.isEligible(couponContext);
      if (!eligibility.ok) {
        return { rule, status: 'blocked' as const, reason: eligibility.reason };
      }
      return { rule, status: 'eligible' as const };
    });
  }, [activeCode, applied, couponContext]);

  const autoRemoveIfInvalid = useCallback(
    (code: string | null) => {
      if (!code) {
        return;
      }
      const nextLines = useCartStore.getState().lines;
      const result = evaluateCoupon(code, {
        itemTotal: itemTotalOf(nextLines),
        lineCount: nextLines.length,
        usedCodes: new Set(usedCouponsRepository.getUsed()),
      });
      if (!result.ok) {
        setActiveCode(null);
        toast.show(result.reason);
      }
    },
    [setActiveCode, toast, usedCouponsRepository],
  );

  const toggleCoupon = useCallback(
    (code: string) => {
      if (activeCode === code) {
        setActiveCode(null);
        return;
      }
      const result = evaluateCoupon(code, {
        itemTotal: itemTotalOf(useCartStore.getState().lines),
        lineCount: useCartStore.getState().lines.length,
        usedCodes: new Set(usedCouponsRepository.getUsed()),
      });
      if (!result.ok) {
        toast.show(result.reason);
        return;
      }
      setActiveCode(code);
    },
    [activeCode, setActiveCode, toast, usedCouponsRepository],
  );

  const placeOrder = useCallback(() => {
    if (useCartStore.getState().lines.length === 0) {
      toast.show('Cart is empty');
      return;
    }
    if (useCartStore.getState().activeCode === 'FIRST100') {
      usedCouponsRepository.markUsed('FIRST100');
      setUsedVersion((value) => value + 1);
    }
    clearCart();
    toast.show('Order placed');
  }, [clearCart, toast, usedCouponsRepository]);

  return {
    lines,
    activeCode: applied?.ok ? activeCode : null,
    bill,
    isEmpty: lines.length === 0,
    couponItems,
    toggleCoupon,
    placeOrder,
    increment: (medicineId: string) => {
      const result = incrementStore(medicineId);
      if (!result.ok) {
        toast.show(result.reason);
        return;
      }
      autoRemoveIfInvalid(useCartStore.getState().activeCode);
    },
    decrement: (medicineId: string) => {
      const result = decrementStore(medicineId);
      if (!result.ok) {
        toast.show(result.reason);
        return;
      }
      autoRemoveIfInvalid(useCartStore.getState().activeCode);
    },
    remove: (medicineId: string) => {
      removeStore(medicineId);
      autoRemoveIfInvalid(useCartStore.getState().activeCode);
    },
  };
}
