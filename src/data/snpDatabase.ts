import { TraitDefinition } from '../types/genetics';
import { HEALTH_CONDITIONS_DATA } from './healthConditions';
import { HEREDITARY_CONDITIONS_DATA } from './hereditaryConditions';
import { PHARMACOLOGY_DATA } from './pharmacology';
import { PERSONAL_TRAITS_DATA } from './personalTraits';
import { WELLNESS_TRAITS_DATA } from './wellnessTraits';

export const TRAIT_DATABASE: TraitDefinition[] = [
  ...HEALTH_CONDITIONS_DATA,
  ...HEREDITARY_CONDITIONS_DATA,
  ...PHARMACOLOGY_DATA,
  ...PERSONAL_TRAITS_DATA,
  ...WELLNESS_TRAITS_DATA
];
