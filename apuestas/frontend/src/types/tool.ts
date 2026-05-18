export interface Tool {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface CartItem {
  tool: Tool;
  quantity: number;
}
