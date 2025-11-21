/**
 * Mobile Action Sheet Component
 * Phase 6 Step 9 - Touch-friendly action menu
 */

"use client";

import { X } from "lucide-react";

interface Action {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

interface MobileActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  actions: Action[];
}

export function MobileActionSheet({
  isOpen,
  onClose,
  title,
  actions,
}: MobileActionSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Action Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-surface-0 rounded-t-2xl shadow-2xl animate-slide-up">
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-border-200">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 rounded-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="p-2">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  action.onClick();
                  onClose();
                }}
                disabled={action.disabled}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg text-left transition-colors ${
                  action.destructive
                    ? "text-red-600 hover:bg-red-50"
                    : "text-ink-900 hover:bg-surface-100"
                } ${action.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {Icon && <Icon className="w-5 h-5" />}
                <span className="font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>

        {/* Cancel Button */}
        <div className="p-4 border-t border-border-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 text-ink-700 font-medium hover:bg-surface-100 rounded-lg"
          >
            Cancel
          </button>
        </div>

        {/* Safe area spacer for iOS */}
        <div className="h-safe-area-inset-bottom" />
      </div>
    </>
  );
}

