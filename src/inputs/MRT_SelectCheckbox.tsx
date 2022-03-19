import React, { ChangeEvent, FC } from 'react';
import { Checkbox, Tooltip } from '@mui/material';
import { useMRT } from '../useMRT';
import type { MRT_Row } from '..';

interface Props {
  row?: MRT_Row;
  selectAll?: boolean;
}

export const MRT_SelectCheckbox: FC<Props> = ({ row, selectAll }) => {
  const {
    localization,
    muiSelectCheckboxProps,
    onSelectChange,
    onSelectAllChange,
    tableInstance,
    tableInstance: {
      state: { densePadding },
    },
  } = useMRT();

  const handleSelectChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (selectAll) {
      tableInstance?.getToggleAllRowsSelectedProps?.()?.onChange?.(event);
      onSelectAllChange?.(
        event,
        event.target.checked ? tableInstance.rows : [],
      );
    } else if (row) {
      row?.getToggleRowSelectedProps()?.onChange?.(event);
      onSelectChange?.(
        event,
        row,
        event.target.checked
          ? [...tableInstance.selectedFlatRows, row]
          : tableInstance.selectedFlatRows.filter(
              (selectedRow) => selectedRow.id !== row.id,
            ),
      );
    }
  };

  const mTableBodyRowSelectCheckboxProps =
    muiSelectCheckboxProps instanceof Function
      ? muiSelectCheckboxProps(selectAll, row, tableInstance)
      : muiSelectCheckboxProps;

  const rtSelectCheckboxProps = selectAll
    ? tableInstance.getToggleAllRowsSelectedProps()
    : row?.getToggleRowSelectedProps();

  const checkboxProps = {
    ...mTableBodyRowSelectCheckboxProps,
    ...rtSelectCheckboxProps,
    style: {
      ...rtSelectCheckboxProps?.style,
      ...mTableBodyRowSelectCheckboxProps?.style,
    },
  };

  return (
    <Tooltip
      arrow
      enterDelay={1000}
      enterNextDelay={1000}
      title={
        selectAll ? localization.toggleSelectAll : localization.toggleSelectRow
      }
    >
      <Checkbox
        inputProps={{
          'aria-label': selectAll
            ? localization.toggleSelectAll
            : localization.toggleSelectRow,
        }}
        size={densePadding ? 'small' : 'medium'}
        {...checkboxProps}
        onChange={handleSelectChange}
        title={undefined}
      />
    </Tooltip>
  );
};
