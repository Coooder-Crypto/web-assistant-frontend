import React from 'react';
import { Button, Box, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface MUIComponentsProps {
  children: React.ReactNode;
}

const MUIComponents: React.FC<MUIComponentsProps> = ({ children }) => {
  return <>{children}</>;
};

export { Button, Box, Paper, DeleteIcon };
export default MUIComponents;
