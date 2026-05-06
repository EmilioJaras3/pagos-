export function Header() {
  return (
    <header className="bg-white border-b border-gray-100 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-1/3 after:bg-[#635bff]">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-2xl mx-auto">
        <div className="text-lg font-bold tracking-tighter text-gray-900 uppercase">
          Vulturus
        </div>
        <span className="material-symbols-outlined text-gray-400">lock</span>
      </div>
    </header>
  );
}
