/**
 * Hook for viewport-aware dropdown positioning using Floating UI.
 * Handles:
 * - Automatic flipping when approaching viewport edges
 * - Proper RTL support
 * - Mobile safe areas
 * - Scroll containers
 */

import { useCallback, useState, useRef, useEffect } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useListNavigation,
  FloatingFocusManager,
  FloatingPortal,
  type Placement,
} from "@floating-ui/react";

interface UseFloatingDropdownOptions {
  /** Initial placement preference (will auto-flip if needed) */
  placement?: Placement;
  /** Offset from trigger element in pixels */
  offsetDistance?: number;
  /** Enable list navigation with keyboard */
  listNavigation?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

export function useFloatingDropdown(options: UseFloatingDropdownOptions = {}) {
  const {
    placement = "bottom-end",
    offsetDistance = 8,
    listNavigation = true,
    onOpenChange,
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);
      if (!open) {
        setActiveIndex(null);
      }
    },
    [onOpenChange]
  );

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open: isOpen,
    onOpenChange: handleOpenChange,
    middleware: [
      offset(offsetDistance),
      // Flip to opposite side if not enough space
      flip({
        fallbackAxisSideDirection: "start",
        padding: 8,
      }),
      // Shift along axis if still not enough space
      shift({
        padding: 8,
        limiter: {
          fn: ({ x, y }) => ({ x, y }),
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "listbox" });

  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    enabled: listNavigation,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    role,
    ...(listNavigation ? [listNav] : []),
  ]);

  // Close on escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleOpenChange]);

  const close = useCallback(() => handleOpenChange(false), [handleOpenChange]);
  const open = useCallback(() => handleOpenChange(true), [handleOpenChange]);
  const toggle = useCallback(() => handleOpenChange(!isOpen), [handleOpenChange, isOpen]);

  return {
    isOpen,
    setIsOpen: handleOpenChange,
    open,
    close,
    toggle,
    refs,
    floatingStyles,
    context,
    getReferenceProps,
    getFloatingProps,
    getItemProps,
    listRef,
    activeIndex,
    setActiveIndex,
    FloatingFocusManager,
    FloatingPortal,
  };
}
