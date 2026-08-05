import logo from "../../../public/logo.png";
import logo2 from "../../../public/darklogo.png";

export default function Logo() {
  return (
    <div className="flex items-center mt-1 md:mt-0">
      {/* Light Mode Logo */}
      <img 
        src={logo} 
        className="h-7 md:h-13 w-auto dark:hidden" 
        alt="Brand Logo" 
      />
      {/* Dark Mode Logo */}
      <img 
        src={logo2} 
        className="h-7 md:h-13 w-auto hidden dark:block" 
        alt="Brand Logo" 
      />
    </div>
  );
}