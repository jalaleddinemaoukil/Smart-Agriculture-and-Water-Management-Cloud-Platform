import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("inline-block", className)}
      {...props}
    >
      <div className="size-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
    </div>
  )
}

export { Spinner }
