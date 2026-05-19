export interface Tool {
  id: string;
  name: string;
  description: string;
  price: number; // en centavos (MXN)
}

export const tools: Tool[] = [
  { id: 'tool-001', name: 'Camiseta Básica', description: 'Algodón 100%, corte slim fit, disponible en 5 colores.', price: 35000 },
  { id: 'tool-002', name: 'Pantalón Cargo', description: 'Bolsillos laterales, tela resistente, estilo urbano.', price: 65000 },
  { id: 'tool-003', name: 'Zapatillas Runner', description: 'Suela con amortiguación, transpirables, para running o diario.', price: 120000 },
  { id: 'tool-004', name: 'Lentes de Sol', description: 'Protección UV400, montura ligera, diseño clásico.', price: 28000 },
  { id: 'tool-005', name: 'Reloj Minimalista', description: 'Correa de cuero sintético, resistencia al agua 3ATM.', price: 45000 },
];
