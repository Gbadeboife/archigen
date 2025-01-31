import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"

interface RenderStyleCardProps {
  name: string
  image: string
  isSelected: boolean
  onSelect: () => void
}

export function RenderStyleCard({ name, image, isSelected, onSelect }: RenderStyleCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      <CardContent className="flex flex-col items-center p-1">
        <Image src={`/_static/images/${image}` || "/placeholder.svg"} alt={name} width={100} height={100} className="mb-2 w-full rounded-md" />
        <h3 className="text-center text-xs sm:text-sm ">{name}</h3>
      </CardContent>
    </Card>
  )
}

