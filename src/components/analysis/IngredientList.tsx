/**
 * F006 - Ingredient List Component
 *
 * Scrollable list of analyzed ingredients with color-coded flags.
 * Red = harmful, Yellow = caution, Green = safe, Gray = unknown.
 */

import type { AnalyzedIngredient, IngredientFlag } from "@/lib/analyzer/types";

const FLAG_STYLES: Record<IngredientFlag, { dot: string; label: string }> = {
  red: { dot: "bg-red-500", label: "Harmful" },
  yellow: { dot: "bg-amber-400", label: "Caution" },
  green: { dot: "bg-emerald-500", label: "Safe" },
  unknown: { dot: "bg-neutral-500", label: "Unknown" },
};

interface IngredientItemProps {
  ingredient: AnalyzedIngredient;
}

function IngredientItem({ ingredient }: IngredientItemProps) {
  const style = FLAG_STYLES[ingredient.flag];

  return (
    <li className="flex items-start gap-3 py-3">
      <span
        className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${style.dot}`}
        aria-label={style.label}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-neutral-200">
            {ingredient.original}
          </span>
          <span className="text-xs text-neutral-500">#{ingredient.position + 1}</span>
        </div>
        <p className="mt-0.5 text-sm text-neutral-400">{ingredient.explanation}</p>
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
    <div>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
        Ingredients ({ingredients.length})
      </h3>
      <ul className="divide-y divide-neutral-800" data-testid="ingredient-list">
        {ingredients.map((item, idx) => (
          <IngredientItem key={`${item.normalized}-${idx}`} ingredient={item} />
        ))}
      </ul>
    </div>
  );
}
