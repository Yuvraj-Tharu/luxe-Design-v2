import { TableCell, TableRow, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface TableHandleEmptyRowsProps {
    children: ReactNode;
    rowNumber: number; // Changed to match your usage
}

export const TableHandleEmptyRows = ({ children, rowNumber }: TableHandleEmptyRowsProps) => {
    if (rowNumber === 0) {
        return (
            <TableRow>
                <TableCell colSpan={6} sx={{ py: 3 }}>
                    <Typography align="center">No Records Found</Typography>
                </TableCell>
            </TableRow>
        );
    }
    return <>{children}</>;
};
