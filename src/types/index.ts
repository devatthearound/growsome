export interface Work {
  id: number
  title: string
  location: string
  year: string
  image: string
}

export interface StoreItem {
  id: number
  title: string
  tags: string[]
  price: number
  image: string
}

export interface BlogPost {
  id: number
  title: string
  subtitle: string
  date: string
  author: {
    name: string
    image: string
  }
  image: string
} 