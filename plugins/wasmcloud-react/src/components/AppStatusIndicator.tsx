import { makeStyles, Theme } from '@material-ui/core/styles';
import { Palette } from '@material-ui/core/styles/createPalette';
import { DeploymentStatus } from '@wasmcloud/lattice-client-core';
import React from 'react';

const statusThemeMap: Record<DeploymentStatus, keyof Palette['status']> = {
  deployed: 'ok',
  failed: 'aborted',
  unknown: 'warning',
  reconciling: 'running',
  undeployed: 'pending',
};

const statusMessageMap: Record<DeploymentStatus, string> = {
  deployed: 'Deployed',
  failed: 'Failed',
  unknown: 'Warning',
  reconciling: 'Reconciling',
  undeployed: 'Undeployed',
};

const useStyles = makeStyles<Theme, AppStatusIndicatorProps>(theme => ({
  dot: {
    height: theme.spacing(1.25),
    width: theme.spacing(1.25),
    marginRight: theme.spacing(1),
    borderRadius: '100%',
    overflow: 'hidden',
    display: 'inline-block',
    verticalAlign: 'baseline',
    backgroundColor: ({ status }) =>
      theme.palette.status[statusThemeMap[status]],
  },
}));

/**
 * Props for {@link AboutField}.
 *
 * @public
 */
export interface AppStatusIndicatorProps {
  status: DeploymentStatus;
}

/** @public */
export function AppStatusIndicator({ status }: AppStatusIndicatorProps) {
  const classes = useStyles({ status });

  return (
    <>
      <div className={classes.dot} />
      <span>{statusMessageMap[status]}</span>
    </>
  );
}
