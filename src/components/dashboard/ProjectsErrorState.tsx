interface Props {
  onRetry: () => void
}

export default function ProjectsErrorState({ onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-red-500 font-medium">שגיאה בטעינת הפרויקטים</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
      >
        נסה שוב
      </button>
    </div>
  )
}
