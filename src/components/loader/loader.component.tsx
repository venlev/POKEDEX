import CircularProgress from '@mui/material/CircularProgress';
import './loader.component.css';
import Paper from '@mui/material/Paper';

const PokedexLoader = () => {
    return (
        <div id="load_screen">
            <div id="load_spinner">
                <span>Loading Pokedex...</span>
                <CircularProgress disableShrink />
            </div>
        </div>
    )
}

export default PokedexLoader;