'use client';

import carImage from '@/public/assets/images/about/car.webp';
import retailImage from '@/public/assets/images/about/cart.webp';
import retailImageActive from '@/public/assets/images/about/cart_active.webp';
import carImageActive from '@/public/assets/images/about/car_active.webp';
import mediaImage from '@/public/assets/images/about/cup.webp';
import mediaImageActive from '@/public/assets/images/about/cup_active.webp';
import serviceImage from '@/public/assets/images/about/lamp.webp';
import serviceImageActive from '@/public/assets/images/about/lamp_active.webp';
import sportImage from '@/public/assets/images/about/sport.webp';
import sportImageActive from '@/public/assets/images/about/sport_active.webp';
import { StaticImageData } from 'next/image';
import { useState } from 'react';
import { IndustriesCard } from './IndustriesCard/IndustriesCard';

export interface IIndustries {
  id: number;
  title: string;
  description: string;
  link: string;
  image: StaticImageData;
  activeImage: StaticImageData;
}

const INDUSTRIES: IIndustries[] = [
  {
    id: 1,
    title: 'Авто',
    description: 'цифровые продукты для спортивного бизнеса',
    link: '/expertise',
    image: carImage,
    activeImage: carImageActive,
  },
  {
    id: 2,
    title: 'Сервис',
    description: 'цифровые продукты для спортивного бизнеса',
    link: '/expertise',
    image: serviceImage,
    activeImage: serviceImageActive,
  },
  {
    id: 3,
    title: 'Медиа',
    description: 'цифровые продукты для спортивного бизнеса',
    link: '/expertise',
    image: mediaImage,
    activeImage: mediaImageActive,
  },
  {
    id: 4,
    title: 'Ритейл',
    description: 'цифровые продукты для спортивного бизнеса',
    link: '/expertise',
    image: retailImage,
    activeImage: retailImageActive,
  },
  {
    id: 5,
    title: 'Спорт',
    description: 'цифровые продукты для спортивного бизнеса',
    link: '/expertise',
    image: sportImage,
    activeImage: sportImageActive,
  },
];

export const Industries = () => {
  const [activeId, setActiveId] = useState<null | number>(null);
  return (
    <div className='flex flex-col gap-[40px] tablet:gap-[20px]'>
      <div className='flex flex-col desktop:flex-row desktop:items-center desktop:gap-[60px] desktop:px-[80px] desktop-hard:gap-[256px]'>
        <div>
          <h2 className='font-unbound text-[32px] font-bold uppercase leading-[1] text-text-dark tablet:text-[50px] tablet:leading-[1.3] desktop:text-[70px]'>
            Отрасли
          </h2>
          <p className='mt-[12px] font-proxima text-[16px] leading-[1.2] text-text-dark tablet:text-[24px] desktop:mt-[24px] desktop:w-[532px]'>
            Наш опыт охватывает все отрасли. Мы имеем наибольший опыт в спорте,
            FMCG, электронной коммерции.
          </p>
        </div>
        <div
          className={`relative mb-[500px] mt-[40px] h-fit laptop:mb-[650px] desktop:mt-[60px] desktop:w-fit desktop-hard:mb-[900px]`}
        >
          {INDUSTRIES.map((item) => (
            <IndustriesCard
              key={item.id}
              data={item}
              activeId={activeId}
              setActiveId={setActiveId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
