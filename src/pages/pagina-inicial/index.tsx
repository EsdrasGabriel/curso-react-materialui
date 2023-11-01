import { Button } from '@mui/material';
import { useAppThemeContext } from '../../shared/contexts';

export const PaginaInicial = () => {
  const { toggleTheme } = useAppThemeContext();

  return (
    <Button variant='contained' color='primary' onClick={toggleTheme}>Toggle Theme</Button>
  );
};