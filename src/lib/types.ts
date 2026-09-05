export type FabricCategory =
  | "Бархат"
  | "Сатин"
  | "Канвас"
  | "Блэкаут"
  | "Подкладочная ткань";

export type FabricOrigin = "Китай" | "Турция";

/**
 * Цветовая гамма ткани хранится не как список конкретных артикулов цвета
 * (в товарной матрице их нет), а как группы оттенков - для фильтрации
 * по цветовой гамме на уровне "спокойный бежевый / графит / золотистый" и т.п.
 */
export type ColorFamily =
  | "Молочный"
  | "Бежевый"
  | "Серый"
  | "Графит"
  | "Коричневый"
  | "Золотистый";

export type Fabric = {
  slug: string;
  name: string;
  category: FabricCategory;
  origin: FabricOrigin;
  widthCm: number;
  densityGsm: number;
  colorsCount: number;
  colorFamilies: ColorFamily[];
  priceUsd: number;
  shortDescription: string;
  description: string;
  highlights: string[];
  image: string;
};

export type WeekDay =
  | "Понедельник"
  | "Вторник"
  | "Среда"
  | "Четверг"
  | "Пятница"
  | "Суббота";

export type DeliveryDirection = "Юг" | "Север";

export type DeliveryGroup = {
  id: string;
  direction: DeliveryDirection;
  title: string;
  description: string;
  days: WeekDay[];
  carriers: string[];
};
