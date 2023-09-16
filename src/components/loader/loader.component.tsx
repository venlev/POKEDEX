import CircularProgress from '@mui/material/CircularProgress';
import './loader.component.css';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

type PokedeLoadxerProps = {
    next?: string,
}

const PokedexLoader = (props: PokedeLoadxerProps) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (props.next) {
            navigate(props.next);
        }
    }, []);

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