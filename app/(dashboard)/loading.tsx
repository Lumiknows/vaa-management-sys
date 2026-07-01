import { BrandedLoader } from "@/components/loading/BrandedLoader"

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center p-6">
      <BrandedLoader />
    </div>
  )
}
