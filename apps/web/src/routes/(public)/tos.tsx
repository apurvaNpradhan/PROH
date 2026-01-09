import PublicLayout from '@/components/layout/public-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/tos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PublicLayout headerContent="Terms of Service">Hello "/(public)/tos"!</PublicLayout>
}
