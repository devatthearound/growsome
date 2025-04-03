export async function getProductData(id: string) {
  // Simulate fetching data from an API or database
  const products: Record<string, {
    title: string;
    description: string;
    price: number;
    image: string;
    tags: string[];
  }> = {
    '1': {
      title: 'Product 1',
      description: 'This is a product description for Product 1',
      price: 100000,
      image: '/images/product1.jpg',
      tags: ['tag1', 'tag2', 'tag3']
    },
    '2': {
      title: 'Product 2',
      description: 'This is a product description for Product 2',
      price: 200000,
      image: '/images/product2.jpg',
      tags: ['tag4', 'tag5', 'tag6']
    }
    // Add more products as needed
  };

  return products[id] || null;
} 