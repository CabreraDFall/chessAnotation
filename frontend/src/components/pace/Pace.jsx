import './Pace.css';
import { TimerIcon } from '../icons';
const Pace = () => {
    return (
        <div className='pace-container'>
            <div className='pace-header'>
                <TimerIcon /> 
                <h4>10' + 5''</h4>
            </div>
        </div>
    );
};  

export default Pace;