import { BackIcon } from '../icons';
import './Header.css';
const Header = () => {
  return (
    <header>
      <div className='header-container'>
        <BackIcon /> 
        <img 
          src="/src/assets/logoBirraChess.jpg"
          alt="Birra Chess Logo"
          className="logo"
          style={{
            height: '40px',
            marginLeft: '10px'
          }}
        />
      </div>
    </header>
  );
};

export default Header;