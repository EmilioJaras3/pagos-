export interface ConnectionBannerProps {
  visible: boolean;
}

export function ConnectionBanner({ visible }: ConnectionBannerProps) {
  if (!visible) return null;

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-center">
      <p className="text-xs text-yellow-700">
        Sin conexion al servidor · Datos pueden estar desactualizados
      </p>
    </div>
  );
}
