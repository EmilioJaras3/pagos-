export interface Tool {
  id: string;
  name: string;
  description: string;
  price: number; // en centavos (MXN)
}

export const tools: Tool[] = [
  { id: 'tool-001', name: 'Destornillador eléctrico', description: 'Atornillado rápido y preciso con batería de litio 12V', price: 45000 },
  { id: 'tool-002', name: 'Taladro percutor 850W', description: 'Para concreto, madera y metal. Velocidad variable.', price: 125000 },
  { id: 'tool-003', name: 'Set llaves hexagonales', description: '25 piezas métricas e imperiales. Acero cromo-vanadio.', price: 32000 },
  { id: 'tool-004', name: 'Multímetro digital', description: 'Mide voltaje, corriente, resistencia y continuidad.', price: 28000 },
  { id: 'tool-005', name: 'Sierra caladora 650W', description: 'Cortes curvos y rectos en madera, metal y plástico.', price: 89000 },
];
