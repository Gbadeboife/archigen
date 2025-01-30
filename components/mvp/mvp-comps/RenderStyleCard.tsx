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
      <CardContent className="p-1 flex flex-col items-center">
        <Image src={`/_static/images/${image}` || "/placeholder.svg"} alt={name} width={100} height={100} className="rounded-md mb-2 w-full" />
        <h3 className="text-center text-xs sm:text-sm ">{name}</h3>
      </CardContent>
    </Card>
  )
}

