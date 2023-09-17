import './poke-card.component.css';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ShieldIcon from '@mui/icons-material/Shield';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import Typography from '@mui/material/Typography';
import PokeBadge from '../poke-badge/poke-badge.component';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton/IconButton';
import { PokemonCard } from '../../typedefinitions/pokemon-typedefs';

export type PokeCardProps = {
    data: PokemonCard
};

const PokeCard = (props: PokeCardProps) => {
    return (
        <Card className='poke-card'>
            <CardContent>
                <div className="poke-image-wrapper">
                    <div className="icon-wrapper">
                        <IconButton>
                            <FavoriteBorderIcon />
                        </IconButton>
                    </div>
                    <img src={props.data.img} alt="" className="src" />
                </div>
                <div className="info-panel">
                    <div className="topline">
                        <Typography variant="subtitle1" gutterBottom>
                            {props.data.name}
                        </Typography>
                        <PokeBadge type={props.data.type} />
                    </div>
                    <div className="stats">
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={6}>
                                <Chip icon={<FavoriteIcon />} label={'HP ' + props.data.stats.hp} variant="outlined" />
                            </Grid>
                            <Grid item xs={6}>
                                <Chip icon={<WhatshotIcon />} label={'ATK ' + props.data.stats.atk} variant="outlined" />
                            </Grid>
                            <Grid item xs={6}>
                                <Chip icon={<ShieldIcon />} label={'DEF ' + props.data.stats.def} variant="outlined" />
                            </Grid>
                            <Grid item xs={6}>
                                <Chip icon={<AutoFixHighIcon />} label={'SP ' + props.data.stats.sp} variant="outlined" />
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default PokeCard;