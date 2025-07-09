interface NavBarProps {
  title: string;
}

function NavBar({ title }: NavBarProps) {
  return (
    <nav className="p-4 bg-blue-500 text-white">
      <h1 className="text-xl font-bold">{title}</h1>
    </nav>
  );
}

export default NavBar;
