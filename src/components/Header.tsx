const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">Lobeca</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="hover:text-brand-tertiary transition-colors">
            Serviços
          </a>
          <a href="#" className="hover:text-brand-tertiary transition-colors">
            Para Barbeiros
          </a>
          <a href="#" className="hover:text-brand-tertiary transition-colors">
            Contato
          </a>
        </nav>
        <div className="flex items-center">
          <button className="bg-brand-primary text-primary-foreground">
            Já sou barbeiro
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
