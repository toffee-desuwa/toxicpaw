/**
 * F006 - Ingredient List Component (polished F013)
 *
 * Scrollable list of analyzed ingredients with color-coded flags.
 * Red = harmful, Yellow = caution, Green = safe, Gray = unknown.
 * Refined spacing, typography, and visual hierarchy for screenshot quality.
 */

import type { AnalyzedIngredient, IngredientFlag } from "@/lib/analyzer/types";

const FLAG_STYLES: Record<IngredientFlag, { dot: string; label: string; badge: string }> = {
  red: { dot: "bg-red-500", label: "Harmful", badge: "bg-red-500/10 text-red-400" },
  yellow: { dot: "bg-amber-400", label: "Caution", badge: "bg-amber-500/10 text-amber-400" },
  green: { dot: "bg-emerald-500", label: "Safe", badge: "bg-emerald-500/10 text-emerald-400" },
  unknown: { dot: "bg-neutral-500", label: "Unknown", badge: "bg-neutral-500/10 text-neutral-400" },
};

interface IngredientItemProps {
  ingredient: AnalyzedIngredient;
}

function IngredientItem({ ingredient }: IngredientItemProps) {
  const style = FLAG_STYLES[ingredient.flag];

  return (
    <li className="flex items-start gap-3 py-3">
      <span
        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`}
        aria-label={style.label}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-100">
            {ingredient.original}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${style.badge}`}>
            {style.label}
          </span>
          <span className="ml-auto text-xs tabular-nums text-neutral-600">
            #{ingredient.position + 1}
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-neutral-400">
          {ingredient.explanation}
        </p>
      </div>
    </li>
  );
}

interface IngredientListProps {
  ingredients: AnalyzedIngredient[];
}

export function IngredientList({ ingredients }: IngredientListProps) {
  if (ingredients.length === 0) {
    return (
      <p className="text-center text-neutral-400" data-testid="empty-list">
        No ingredients to display.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Ingredients ({ingredients.length})
      </h3>
      <ul className="divide-y divide-neutral-800/50" data-testid="ingredient-list">
        {ingredients.map((item, idx) => (
          <IngredientItem key={`${item.normalized}-${idx}`} ingredient={item} />
        ))}
      </ul>
    </div>
  );
}
