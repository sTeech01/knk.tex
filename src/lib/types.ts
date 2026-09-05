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

/**
 * Один оттенок ткани - как он снят и пронумерован поставщиком.
 * Заказчик фотографирует палитру покадрово, поэтому номер на фотографии
 * и есть идентификатор оттенка при заказе.
 */
export type FabricColor = {
  /** Номер оттенка в палитре поставщика, например "12" или "A-04". */
  code: string;
  /** Фотография именно этого оттенка. */
  image: string;
  /** Название оттенка, если поставщик его указывает. */
  name?: string;
};

export type Fabric = {
  slug: string;
  name: string;
  category: FabricCategory;
  origin: FabricOrigin;
  widthCm: number;
  densityGsm: number;
  /** Заявленное число оттенков из товарной матрицы. */
  colorsCount: number;
  colorFamilies: ColorFamily[];
  priceUsd: number;
  shortDescription: string;
  description: string;
  highlights: string[];
  /** Обложка ткани - используется в каталоге и как общий вид на карточке. */
  image: string;
  /**
   * Отснятая палитра оттенков. Пока фотографии не готовы, поле опущено -
   * карточка показывает только общий вид. Как только появляются снимки,
   * достаточно добавить сюда массив, и галерея включается сама.
   */
  colors?: FabricColor[];
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
