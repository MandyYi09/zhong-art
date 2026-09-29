import { createFileRoute } from '@tanstack/react-router'
import { DeckPage } from '@/pages/deck'
export const Route = createFileRoute('/deck')({ component: DeckPage })
