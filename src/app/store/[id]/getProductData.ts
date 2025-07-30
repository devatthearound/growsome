export async function getProductData(id: string) {
  // Store 페이지의 실제 데이터와 일치하는 상품 데이터
  const products: Record<string, {
    title: string;
    description: string;
    price: number | string;
    originalPrice?: number;
    image: string;
    tags: string[];
  }> = {
    '1': {
      title: '자연스러운 동정 결렉션',
      description: 'AI로 제작된 자연스러운 동정 컬렉션입니다. Midjourney를 활용하여 제작된 고품질의 동정 디자인으로, 다양한 스타일과 색상으로 구성되어 있습니다.',
      price: 25000,
      originalPrice: 30000,
      image: '/images/store/product1.jpg',
      tags: ['Midjourney', '동정', '자연']
    },
    '2': {
      title: '미니멀 로고 디자인',
      description: 'AI로 제작된 미니멀한 로고 디자인 템플릿입니다. DALL-E를 활용하여 브랜드 아이덴티티에 맞는 깔끔하고 기억에 남는 로고를 제작할 수 있습니다.',
      price: 35000,
      originalPrice: 40000,
      image: '/images/store/product2.jpg',
      tags: ['DALL-E', '로고', '브랜딩']
    },
    '3': {
      title: '캐릭터 일러스트',
      description: 'AI로 제작된 귀여운 캐릭터 일러스트입니다. Stable Diffusion을 활용하여 독특하고 매력적인 캐릭터를 제작할 수 있으며, 다양한 감정과 포즈로 구성되어 있습니다.',
      price: 30000,
      image: '/images/store/product3.jpg',
      tags: ['Stable Diffusion', '캐릭터', '일러스트']
    },
    '4': {
      title: '제품 상세페이지 템플릿',
      description: '쇼핑몰 제품 상세페이지를 위한 AI 디자인 템플릿입니다. 제품 이미지, 설명, 가격 정보 등을 효과적으로 배치하여 매출 증대를 도와줍니다.',
      price: '40,000',
      image: '/images/store/product4.jpg',
      tags: ['디자인', '쇼핑몰', '템플릿']
    },
    '5': {
      title: '프로덕트 목업 세트',
      description: '3D 목업을 활용한 제품 프레젠테이션 세트입니다. 브랜딩에 활용할 수 있는 고품질의 제품 시각화 자료를 제공합니다.',
      price: '28,000',
      image: '/images/store/product5.jpg',
      tags: ['목업', '브랜딩', '3D']
    },
    '6': {
      title: '추상 아트 컬렉션',
      description: 'Midjourney로 제작된 추상 아트 컬렉션입니다. 현대적이고 예술적인 디자인으로 인테리어나 브랜딩에 활용할 수 있습니다.',
      price: '32,000',
      image: '/images/store/product6.jpg',
      tags: ['Midjourney', '추상', '예술']
    }
  };

  return products[id] || null;
} 