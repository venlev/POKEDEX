import React from 'react';
import './poke-badge.component.css'
import Chip from '@mui/material/Chip';
import { PokemonTypes } from '../../typedefinitions/pokemon-typedefs';

export type PokeBadgeProps = {
    type: string
}

const getTypeAssociatedColor = (type: PokemonTypes | string): TypeAssociatedColor => {
    switch (type) {
        case 'fire':
            return 'error';
        case 'grass':
            return 'success';
        case 'electric':
            return 'warning'
        default:
            return 'default';
    }
}

const PokeBadge = (data: PokeBadgeProps) => {
    return (
        <Chip label={data.type} color={getTypeAssociatedColor(data.type)} />
    )
}

export type TypeAssociatedColor = 'error' | 'primary' | 'success' | 'warning' | 'default';

export default PokeBadge;