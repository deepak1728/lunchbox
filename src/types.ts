export type Slot = "rice" | "curry" | "dal" | "fruits" | "dessert";

export type PlateType = "veg" | "nonveg";

export interface Item {
  id: number;
  name: string;
  image: string;
  slot: Slot;
}

export interface CartOrder {
  selectedItems: Partial<Record<Slot, Item>>;
  plateType: PlateType;
  quantity: number;
  pricePerBox: number;
  defaultCurry?: Item;
  defaultDal?: Item;
}
